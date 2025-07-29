import { Router } from 'express';
import { login, register, uploadProfilePicture, updateUserProfile, getUserAndProfile, updateProfileData, getAllUserProfile, downloadProfile, sendConnectionRequest, getMyConnectionRequests, whatAreMyConnections, acceptConnectionRequest, getUserProfileAndUserBasedOnUsername } from '../controllers/user.controller.js';
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, 'uploads/')
    },
    filename: (req, file, cd) => {
        cd(null, file.originalname)
    }
})

const upload = multer({ storage: storage})

router.route("/update_profile_picture")
    .post(upload.single('profile_picture'), uploadProfilePicture)

router.route('/register').post(register);
router.route('/login').post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route('/user/get_all_users').get(getAllUserProfile);
router.route('/user/download_resume').get(downloadProfile);
router.route('/user/send_connection_request').post(sendConnectionRequest);//1
router.route('/user/get_connection_request').get(getMyConnectionRequests);
router.route('/user/user_connection_request').get(whatAreMyConnections);//3
router.route('/user/accept_connection_request').post(acceptConnectionRequest);//4
router.route('/user/get_profile_based_on_username').get(getUserProfileAndUserBasedOnUsername);

export default router;