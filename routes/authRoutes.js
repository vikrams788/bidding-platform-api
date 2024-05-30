const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', [
    body('username').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
], authController.register);

router.post('/login', [
    body('email').isEmail(),
    body('password').exists(),
], authController.login);

router.get('/profile', authController.profile);

module.exports = router;