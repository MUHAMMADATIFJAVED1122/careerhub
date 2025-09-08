// import React, { useEffect, useState } from "react";
// import PostCard from "./PostCard";
// import axios from "axios";

// const Feed = ({ currentUser }) => {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     axios.get("/api/posts")
//       .then(res => setPosts(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   const handleDelete = async (postId) => {
//     try {
//       await axios.delete(`/api/posts/${postId}`);
//       setPosts(posts.filter(p => p._id !== postId));
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };

//   const handleEdit = (post) => {
//     // For now just alert, you can open a modal later
//     alert("Editing post: " + post.content);
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-6">
//       {posts.map(post => (
//         <PostCard
//           key={post._id}
//           post={post}
//           currentUserId={currentUser._id}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//         />
//       ))}
//     </div>
//   );
// };

// export default Feed;
