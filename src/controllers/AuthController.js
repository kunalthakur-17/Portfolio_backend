const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );
};

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid email format",
      });
    }

    // 3. Password validation
    if (password.length < 6) {
      return res.status(400).json({
        status: "fail",
        message: "Password must be at least 6 characters",
      });
    }

    // 4. Check existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message: "User already exists with this email",
      });
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create user (role should NOT come from req.body)
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // 7. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 8. Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // 9. Response
    res.status(201).json({
        status: 201,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}



async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Email and password are required",
      });
    }

    // 2. Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    // 3. Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    // 4. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 5. Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // 6. Response
    res.status(200).json({
        status: 201,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

const logOut = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({
    message: "Logout successful",
  });
};


const authController = {
  registerUser,
  loginUser,
  logOut,
};


module.exports = authController;
