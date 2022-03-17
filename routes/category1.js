const express = require('express');
const router = express.Router();
const { getPolicy } = require('../controller/category1')

router.post('/search', getPolicy)

module.exports = router;