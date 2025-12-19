const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Search by title or tags
router.get('/', async (req, res) => {
  try {
    const { q, tag, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (tag) filter.tags = tag;

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'username');

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
