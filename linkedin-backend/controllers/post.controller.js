import Post from "../models/Post.model.js";
import Notification from "../models/Notification.model.js";
import cloudinary from "cloudinary";

// ==========================
// Create a new post
// ==========================
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const newPost = new Post({
      content,
      author: req.user._id,
    });

    // ✅ Upload image to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
      });
      newPost.image = result.secure_url; // ✅ Cloudinary URL
    }

    await newPost.save();
    await newPost.populate({ path: "author", select: "username email profilePicture" });

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
};
// ==========================
// Get ALL posts
// ==========================
export const getAllPosts = async (req, res) => {
  try {
    const currentUserId = req.user ? req.user.id : null;

    const posts = await Post.find()
      .populate("author", "username email profilePicture")
      .populate("comments.user", "username email profilePicture")
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      content: post.content,
      image: post.image,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likesCount: post.likes.length,
      likedByCurrentUser: currentUserId ? post.likes.includes(currentUserId) : false,
      comments: post.comments.map((c) => ({
        _id: c._id,
        text: c.text,
        createdAt: c.createdAt,
        user: c.user, // includes username + profilePicture
      })),
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};

// ==========================
// Get ONLY logged-in user's posts
// ==========================
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate("author", "username email profilePicture")
      .populate("comments.user", "username email profilePicture")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your posts", error: err.message });
  }
};

// ==========================
// Get posts by a specific user
// ==========================
export const getPostsByUser = async (req, res) => {
  try {
    const { id } = req.params; // userId
    const posts = await Post.find({ author: id })
      .populate("author", "username email profilePicture")
      .populate("comments.user", "username email profilePicture")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user's posts", error: err.message });
  }
};

// ==========================
// Get SINGLE post by ID
// ==========================
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("author", "username email profilePicture")
      .populate("comments.user", "username email profilePicture");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
};

// ==========================
// Update post
// ==========================

// export const updatePost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const post = await Post.findById(id);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     if (post.author.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     // update text
//     post.content = req.body.content || post.content;

//     // if new image uploaded
//     if (req.file) {
//       if (post.image) {
//         const oldPath = path.join(process.cwd(), post.image);
//         fs.unlink(oldPath, (err) => {
//           if (err) console.warn("⚠️ Could not delete old image:", err.message);
//         });
//       }
//        post.image = req.file.path;
//     }

//     await post.save();
//     await post.populate({ path: "author", select: "username email profilePicture" });

//     res.json({ message: "Post updated", post });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // update text
    post.content = req.body.content || post.content;

    // ✅ If new image uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
      });
      post.image = result.secure_url; // ✅ replace old image
    }

    await post.save();
    await post.populate({ path: "author", select: "username email profilePicture" });

    res.json({ message: "Post updated", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// ==========================
// Delete post
// ==========================
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================
// Like / Unlike post
// ==========================
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate("author");
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    let message = "";

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((uid) => uid.toString() !== userId);
      message = "Post unliked";
    } else {
      post.likes.push(userId);
      message = "Post liked";

      if (post.author._id.toString() !== userId) {
        await Notification.create({
          type: "like",
          fromUser: userId,
          toUser: post.author._id,
          post: post._id,
          message: `${req.user.username} liked your post`,
        });
      }
    }

    await post.save();
    res.json({ message, likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// Add comment
// ==========================
export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

    const post = await Post.findById(id).populate("author");
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = { user: req.user.id, text };
    post.comments.push(comment);
    await post.save();

    const populatedPost = await Post.findById(id).populate("comments.user", "username email profilePicture");
    const newComment = populatedPost.comments[populatedPost.comments.length - 1];

    if (post.author._id.toString() !== req.user.id) {
      await Notification.create({
        type: "comment",
        fromUser: req.user.id,
        toUser: post.author._id,
        post: post._id,
        message: `${req.user.username} commented on your post`,
      });
    }

    res.json({ message: "Comment added", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==========================
// Delete comment
// ==========================
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.find((c) => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    await post.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
