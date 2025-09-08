import User from "../models/user.model.js";
import Notification from "../models/Notification.model.js";
// controllers/connection.controller.js
//import Notification from "../models/Notification.model.js";

export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === String(currentUserId)) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });
    if (targetUser.followers.includes(currentUserId)) {
      return res.status(400).json({ message: "Already following" });
    }

    targetUser.followers.push(currentUserId);
    currentUser.following.push(targetUserId);
    await targetUser.save();
    await currentUser.save();

    // ✅ Create notification with message
    await Notification.create({
      type: "follow",
      fromUser: currentUserId,
      toUser: targetUserId,
        message: "started following you"
      // message: `${currentUser.username} started following you`
    });

    res.json({ message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Follow User
// export const followUser = async (req, res) => {
//   try {
//     const targetUserId = req.params.id;
//     const currentUserId = req.user._id;

//     if (targetUserId === String(currentUserId)) {
//       return res.status(400).json({ message: "You cannot follow yourself" });
//     }

//     const targetUser = await User.findById(targetUserId);
//     const currentUser = await User.findById(currentUserId);

//     if (!targetUser) return res.status(404).json({ message: "User not found" });

//     // already following?
//     if (targetUser.followers.includes(currentUserId)) {
//       return res.status(400).json({ message: "Already following" });
//     }

//     targetUser.followers.push(currentUserId);
//     currentUser.following.push(targetUserId);

//     await targetUser.save();
//     await currentUser.save();

//     res.json({ message: "Followed successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// ✅ Follow User
// export const followUser = async (req, res) => {
//   try {
//     const targetUserId = req.params.id;
//     const currentUserId = req.user._id;

//     if (targetUserId === String(currentUserId)) {
//       return res.status(400).json({ message: "You cannot follow yourself" });
//     }

//     const targetUser = await User.findById(targetUserId);
//     const currentUser = await User.findById(currentUserId);

//     if (!targetUser) return res.status(404).json({ message: "User not found" });

//     // already following?
//     if (targetUser.followers.includes(currentUserId)) {
//       return res.status(400).json({ message: "Already following" });
//     }

//     targetUser.followers.push(currentUserId);
//     currentUser.following.push(targetUserId);

//     await targetUser.save();
//     await currentUser.save();

//     // ✅ Create a notification
//     const newNotification = new Notification({
//       type: "follow",
//       fromUser: currentUserId,
//       toUser: targetUserId
//     });
//     await newNotification.save();

//     res.json({ message: "Followed successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// ✅ Unfollow User
export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    targetUser.followers = targetUser.followers.filter(
      (id) => String(id) !== String(currentUserId)
    );
    currentUser.following = currentUser.following.filter(
      (id) => String(id) !== String(targetUserId)
    );

    await targetUser.save();
    await currentUser.save();

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get followers
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers", "username email");
    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get following
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("following", "username email");
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
