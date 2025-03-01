import { Router } from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    addFriend,
    removeFriend, updateUser,
} from '../../controllers/user-controller.js';

const userRoutes = Router();

// /api/users
userRoutes.route('/').get(getAllUsers).post(createUser);

// /api/users/:userId    ( replace :userId with actual Id generated from exhisting user)
userRoutes.route('/:userId').get(getUserById).delete(deleteUser).put(updateUser);

// /api/users/:userId/friends/:friendId
userRoutes.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend); // 

export default userRoutes;
