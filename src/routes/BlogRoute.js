const express = require("express");

const BlogController = require("../controllers/BlogController");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post("/", adminAuth, BlogController.createBlogController);
router.get("/", BlogController.getAllBlogsController);
router.get("/:id", BlogController.getBlogByIdController);
router.put("/:id", adminAuth, BlogController.updateBlogController);
router.delete("/:id", adminAuth, BlogController.deleteBlogController);
module.exports = router;
