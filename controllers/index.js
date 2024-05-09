const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const fileRoutes = require('./fileRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/files', fileRoutes);

module.exports = router;
