const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Add comment
router.post('/:postId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Missing content' });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = new Comment({ post: post._id, author: req.user._id, content });
    await comment.save();

    post.commentsCount = (post.commentsCount || 0) + 1;
    await post.save();

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (!comment.author.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    const post = await Post.findById(comment.post);
    if (post) {
      post.commentsCount = Math.max(0, (post.commentsCount || 1) - 1);
      await post.save();
    }

    await Comment.deleteOne({ _id: comment._id });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
