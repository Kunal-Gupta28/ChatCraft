const express = require('express')
const router = express.Router();
const {getResult} = require('../controllers/ai.controller')

router.get('/get-result',getResult)

module.exports = router