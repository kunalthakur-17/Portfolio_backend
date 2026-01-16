const express = require("express")
const router = express.Router()
const workContoller = require("../controllers/WorkController")

router.post("/", workContoller.createController)
router.get("/", workContoller.getAllWorksController)
router.get("/:id", workContoller.getWorkByIdController)
router.put("/:id", workContoller.updateWorkController)
router.delete("/:id", workContoller.deleteWorkController)

module.exports = router
