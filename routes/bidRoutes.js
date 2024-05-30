const express = require('express');
const { body } = require('express-validator');
const bidController = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:itemId/bids', bidController.getAllBids);
router.post('/:itemId/bids', authMiddleware, [
    body('bid_amount').isDecimal(),
], bidController.placeBid);

module.exports = router;