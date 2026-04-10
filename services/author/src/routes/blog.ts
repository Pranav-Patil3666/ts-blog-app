import express from 'express';
import { createBlog, updateBlog, deleteBlog } from '../controllers/blog.js';
import { isAuth } from '../middlewares/isAuth.js';
import uploadFile from '../middlewares/multer.js';
const router= express.Router();

router.post("/blog/new", isAuth,uploadFile,createBlog);
router.post("/blog/update/:id", isAuth,uploadFile, updateBlog)
router.delete("/blog/delete/:id", isAuth,deleteBlog)

export default router;