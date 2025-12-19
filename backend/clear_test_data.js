const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const clearTestData = async () => {
  // Connect to database
  await connectDB();

  try {
    console.log('Deleting test posts...');
    
    // Find and delete the test posts
    const result = await Post.deleteMany({
      title: {
        $in: ['Smoke Test Post 712559', 'Smoke Test Post 710241']
      }
    });

    console.log(`Deleted ${result.deletedCount} test posts`);

    // Delete any associated comments
    const commentResult = await Comment.deleteMany({
      post: { $in: result.deletedIds }
    });

    console.log(`Deleted ${commentResult.deletedCount} associated comments`);

  } catch (error) {
    console.error('Error during deletion:', error);
  }

  // Close connection
  await mongoose.connection.close();
};

clearTestData()
  .then(() => console.log('Test data cleanup completed'))
  .catch(err => console.error('Error cleaning test data:', err));