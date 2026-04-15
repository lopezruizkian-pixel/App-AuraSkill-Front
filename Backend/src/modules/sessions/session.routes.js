const express = require('express');
const { getHistorial, getSesion } = require('./session.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/history', verifyToken, getHistorial);
router.get('/room/:roomId', verifyToken, getSesion);

module.exports = router;
