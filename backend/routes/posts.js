const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Missing title or content' });
    const post = new Post({ author: req.user._id, title, content, tags: tags || [] });
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts (with optional tag filter and pagination)
router.get('/', async (req, res) => {
  try {
    const { tag, page = 1, limit = 10 } = req.query;
    const filter = {};
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

// Get single post by id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username email');
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comments = await Comment.find({ post: post._id }).populate('author', 'username');
    res.json({ post, comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.author.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    const { title, content, tags } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.author.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    await Comment.deleteMany({ post: post._id });
    await Post.deleteOne({ _id: post._id });

    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
