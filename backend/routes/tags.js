const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// List tags with counts
router.get('/', async (req, res) => {
  try {
    const tags = await Post.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $project: { tag: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
