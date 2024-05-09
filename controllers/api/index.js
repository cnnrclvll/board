const router = require('express').Router();
const userRoutes = require('./userRoutes');
const fileRoutes = require('./fileRoutes');

router.use('/user', userRoutes);
router.use('/file', fileRoutes);

module.exports = router;
