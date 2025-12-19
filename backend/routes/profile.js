const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Get user profile and their posts
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'username');

    res.json({
      user: {
        username: user.username,
        id: user._id,
        createdAt: user.createdAt
      },
      posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;