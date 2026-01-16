const express = require("express")
const router = express.Router()
const workContoller = require("../controllers/WorkController")
const adminAuth = require("../middleware/adminAuth")

router.post("/", adminAuth, workContoller.createController)
router.get("/", workContoller.getAllWorksController)
router.get("/:id", workContoller.getWorkByIdController)
router.put("/:id", adminAuth, workContoller.updateWorkController)
router.delete("/:id", adminAuth, workContoller.deleteWorkController)

module.exports = router
