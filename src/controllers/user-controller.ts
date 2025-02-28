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
    const { userId, friendId } = req.params;

    try {
        // Ensure both users exist
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User or friend not found." });
        }

        // Prevent self-friendship
        if (userId === friendId) {
            return res.status(400).json({ message: "User cannot add themselves as a friend." });
        }

        // Add friend
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { friends: friendId } }, // Avoids duplicate friends
            { new: true, runValidators: true }
        );

        // Ensure bi-directional friendship
        await User.findByIdAndUpdate(
            friendId,
            { $addToSet: { friends: userId } },
            { new: true }
        );

        return res.json({ message: "Friend added successfully!", user: updatedUser });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};




// // remove friend from friend list
export const removeFriend = async (req: Request, res: Response) => {
  const { userId, friendId } = req.params;

  try {
      // Ensure both users exist
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
          return res.status(404).json({ message: "User or friend not found." });
      }

      // Remove friend from user's list
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $pull: { friends: friendId } }, // Removes friend from array
          { new: true }
      );

      // Ensure bi-directional removal
      await User.findByIdAndUpdate(
          friendId,
          { $pull: { friends: userId } },
          { new: true }
      );

      return res.json({ message: "Friend removed successfully!", user: updatedUser });
  } catch (error: any) {
      return res.status(500).json({ message: error.message });
  }
};
