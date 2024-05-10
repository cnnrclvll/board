const router = require('express').Router();
const userRoutes = require('./userRoutes');
const fileRoutes = require('./fileRoutes');
const postRoutes = require('./postRoutes');
const boardRoutes = require('./boardRoutes');

router.use('/user', userRoutes);
router.use('/file', fileRoutes);
router.use('/post', postRoutes);
router.use('/board', boardRoutes);

module.exports = router;
