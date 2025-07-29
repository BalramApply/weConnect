import { Router } from 'express';
import { activeCheck, commentPost, createPost, deleteCommentOfUser, deletePost, getAllPosts, getCommentByPost, increamentLikes } from "../controllers/post.comtroller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

// Add file size limit and filter
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 // 50KB in bytes
    },
    fileFilter: (req, file, cb) => {
        // Check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// const upload = multer({ storage: storage})

router.route('/').get(activeCheck);

// router.route("/post").post(upload.single('media'), createPost);

// Updated route with error handling
router.route("/post").post((req, res, next) => {
    upload.single('media')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'Image size must be less than 50KB'
                });
            }
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    });
}, createPost);

router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(getCommentByPost);
router.route("/delete_comment").delete(deleteCommentOfUser);
router.route("/increament_post_like").post(increamentLikes);

export default router;