const express = require("express");

const BlogController = require("../controllers/BlogController");

const router = express.Router();

router.post("/", BlogController.createBlogController);
router.get("/", BlogController.getAllBlogsController);
router.get("/:id", BlogController.getBlogByIdController);
router.put("/:id", BlogController.updateBlogController);
router.delete("/:id", BlogController.deleteBlogController);
module.exports = router;
