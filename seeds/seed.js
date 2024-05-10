const sequelize = require('../config/connection.js'); // Assuming connection.js is in the same directory
const { Users, Boards, Posts, Tags } = require('../models'); // Assuming models are in '../models'

const userData = require('./userData.json');
const boardData = require('./boardData.json');
const postData = require('./postData.json');
const tagData = require('./tagData.json');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    // Seed users
    const users = await Users.bulkCreate(userData);

    // Seed boards
    const boards = await Boards.bulkCreate(boardData);

    // Seed tags
    const tags = await Tags.bulkCreate(tagData);

    // Seed posts
    const posts = await Posts.bulkCreate(postData.map(post => ({
      ...post,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      board_id: boards[Math.floor(Math.random() * boards.length)].id
    })));

    // Seed board-tags associations

    console.log('Database seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();