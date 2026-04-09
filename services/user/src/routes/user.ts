import express from 'express';
import {loginUser, myProfile,getUserProfile, updateProfile, updateProfilePic} from '../controllers/user.js';
import {isAuth} from '../middleware/isAuth.js';
import uploadFile from '../middleware/multer.js';

const router = express.Router();

router.post('/login',loginUser);
router.get('/me',isAuth,myProfile);
router.get('/user/:id',getUserProfile);
router.post('/user/update',isAuth,updateProfile);
router.post('/update/pic', isAuth,uploadFile ,updateProfilePic);

export default router;