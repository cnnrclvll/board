const sequelize = require("../config/connection.js"); // Assuming connection.js is in the same directory
const { Users, Boards, Posts, Tags } = require("../models"); // Assuming models are in '../models'

const userData = require("./userData.json");
const boardData = require("./boardData.json");
const postData = require("./postData.json");
const tagData = require("./tagData.json");

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    // Seed users
    const users = await Users.bulkCreate(userData, { individualHooks: true });

    // Seed tags
    // const tags = await Tags.bulkCreate(tagData);

    // Seed boards
    const boards = await Promise.all(
      boardData.map(async (board) => {
        const newBoard = await Boards.create({
          title: board.title,
        });

        // Seed board-tags associations
        await Promise.all(
          board.tags.map(async (tag) => {
            const [newTag] = await Tags.findOrCreate({
              where: { tag_name: tag },
            });

            await newBoard.addTag(newTag);
          })
        );

        return newBoard;
      })
    );

    // Seed posts
    const posts = await Posts.bulkCreate(
      postData.map((post) => ({
        ...post
      }))
    );

    // Seed board-tags associations

    console.log("Database seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
