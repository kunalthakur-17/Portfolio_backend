const express = require("express")
const authController = require("../controllers/AuthController")

const router = express.Router()

router.post("/register", authController.registerUser)
router.post("/login", authController.loginUser)
router.post("/logout", authController.logOut)


module.exports = router