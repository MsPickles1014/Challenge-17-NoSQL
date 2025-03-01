// import { ObjectId } from 'mongodb';
import { User, Thought } from '../models/index.js';
import { Request, Response } from 'express';

// get all users
export const getAllUsers = async (_req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  }

// get single user by id

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params; // Extract userId from request parameters
  try {
      const user = await User.findById(userId);
      if (user) {
          res.json({ user });
      } else {
          res.status(404).json({
              message: 'User not found'
          });
      }
  } catch (error: any) {
      res.status(500).json({
          message: error.message
      });
  }
};

// create a new user
export const createUser = async (req: Request, res: Response) => {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }


// update a user

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params; // Extract userId from request parameters
  try {
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });

      if (updatedUser) {
          res.json({ message: 'User updated successfully', user: updatedUser });
      } else {
          res.status(404).json({
              message: 'User not found'
          });
      }
  } catch (error: any) {
      res.status(500).json({
          message: error.message
      });
  }
};


// delete user (BONUS: and delete associated thoughts)
export const deleteUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and associated thought deleted!' })
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }

  
// add friend to friend list
export const addFriend = async (req: Request, res: Response) => {
  try {
      const user = await User.findByIdAndUpdate(
          req.params.userId,
          { $addToSet: { friends: req.params.friendId } },
          { new: true, runValidators: true }
      );

      if (user) {
          return res.json({ message: "Friend added successfully", user }); 
      } else {
          return res.status(404).json({ message: "User not found" }); 
      }
  } catch (err) {
      return res.status(500).json({ message: (err as Error).message }); 
  }
};


// Remove friend from friend list
export const removeFriend = async (req: Request, res: Response) => {
  const { userId, friendId } = req.params; 

  try {
      const user = await User.findByIdAndUpdate(
          userId,
          { $pull: { friends: friendId } }, 
          { new: true }
      );

      if (user) {
          return res.json({ message: "Friend removed successfully", user }); 
      } else {
          return res.status(404).json({ message: "User not found" }); 
      }
  } catch (err) {
      return res.status(500).json({ message: (err as Error).message }); 
  }
};






