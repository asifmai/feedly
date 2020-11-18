const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexcontroller');
const feedlyController = require('../controllers/feedlycontroller');

/* GET - Public - home page */
router.get('/', feedlyController.callback_get);

router.post('/searchfeedly', feedlyController.searchfeedly_post)

module.exports = router;
