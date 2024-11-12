const express = require('express');
const router = express.Router();
const createUser  = require('../controllers/UseController');

router.route('/create').post(createUser);

module.exports = router;