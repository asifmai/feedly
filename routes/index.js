const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexcontroller');
const feedlyController = require('../controllers/feedlycontroller');

/* GET - Public - home page */
router.get('/', indexController.index_get);

router.get('/feedlycallback', feedlyController.callback_get)

module.exports = router;
