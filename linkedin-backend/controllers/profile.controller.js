import User from "../models/User.model.js";

export const getProfile = async (req, res) => {
  try {
    res.json({
      message: "User profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email, bio, location, jobTitle, company, skills } = req.body;

    // Handle uploaded files
    const profilePicture = req.files?.profilePicture
      ? req.files.profilePicture[0].path 
      : req.body.profilePicture;

    const coverPhoto = req.files?.coverPhoto
      ? req.files.coverPhoto[0].path 
      : req.body.coverPhoto;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          username,
          email,
          bio,
          location,
          jobTitle,
          company,
          skills: skills ? (Array.isArray(skills) ? skills : skills.split(",")) : [],
          profilePicture,
          coverPhoto,
        },
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
