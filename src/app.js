const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const UserRoute = require("./routes/UserRoute")
const WorkRoute = require("./routes/WorkRoute")
const BlogRoute = require("./routes/BlogRoute")
const ContactRoute = require("./routes/ContactRoute")

const app = express()
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/user", UserRoute )
app.use("/api/v1/work", WorkRoute)
app.use("/api/v1/blog", BlogRoute)
app.use("/api/v1/contact", ContactRoute)


module.exports = app