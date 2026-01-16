const app = require("./src/app")
const dotenv = require("dotenv")
const connectToMongoDB = require("./src/db/db")
dotenv.config()


const port = process.env.PORT || 8000


connectToMongoDB().then(()=>{
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
})

