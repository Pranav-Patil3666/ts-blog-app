import express from 'express';
import { createBlog, updateBlog, deleteBlog, addComment,
  getComments,
  saveBlog,
  getSavedBlogs } from '../controllers/blog.js';
import { isAuth } from '../middlewares/isAuth.js';
import uploadFile from '../middlewares/multer.js';
const router= express.Router();

router.post("/blog/new", isAuth,uploadFile,createBlog);
router.post("/blog/update/:id", isAuth,uploadFile, updateBlog)
router.delete("/blog/delete/:id", isAuth,deleteBlog)
router.post("/comment", isAuth, addComment);
router.get("/comments/:blogid", getComments);

// SAVE BLOG
router.post("/save", isAuth, saveBlog);
router.get("/saved/:userid", getSavedBlogs);

export default router;