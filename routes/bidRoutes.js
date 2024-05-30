const express = require('express');
const { check } = require('express-validator');
const bidController = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');
const { placeBid } = require('../controllers/bidController');
const router = express.Router();

module.exports = (io) => {

    router.get('/:itemId/bids', authMiddleware, bidController.getAllBids);

    router.post('/:itemId/bids', authMiddleware, [
        check('bid_amount', 'Bid amount is required').isDecimal(),
    ], (req, res) => placeBid(req, res, io));
    
    return router;
};  