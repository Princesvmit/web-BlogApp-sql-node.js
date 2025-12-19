const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const testDB = async () => {
  // Connect to database
  await connectDB();

  try {
    // 1. Find user by username
    console.log('\n1. Finding user by username:');
    const userByUsername = await User.findOne({ username: /smoke/ });
    console.log(userByUsername ? userByUsername.username : 'No user found');

    // 2. Find latest posts (newest first)
    console.log('\n2. Latest posts (top 3):');
    const latestPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title createdAt');
    console.log(latestPosts);

    // 3. Find posts by tag
    console.log('\n3. Posts with "test" tag:');
    const postsByTag = await Post.find({ tags: 'test' })
      .select('title tags');
    console.log(postsByTag);

    // 4. Get post with author details
    console.log('\n4. Post with author details:');
    const postWithAuthor = await Post.findOne()
      .populate('author', 'username email')
      .select('title author');
    console.log(postWithAuthor);

    // 5. Get posts created in the last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    console.log('\n5. Posts from last 24 hours:');
    const recentPosts = await Post.find({ 
      createdAt: { $gte: last24Hours } 
    }).select('title createdAt');
    console.log(recentPosts);

    // 6. Count comments per post
    console.log('\n6. Comments count for each post:');
    const postsWithComments = await Post.find()
      .select('title commentsCount');
    console.log(postsWithComments);

  } catch (error) {
    console.error('Error during database queries:', error);
  }

  // Close connection
  await mongoose.connection.close();
};

testDB()
  .then(() => console.log('\nDatabase test completed'))
  .catch(err => console.error('Error testing database:', err));