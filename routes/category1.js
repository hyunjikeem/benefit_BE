const express = require('express');
const router = express.Router();
const { getPolicy } = require('../controller/category1')

router.get('/search/:params', getPolicy)

module.exports = router;