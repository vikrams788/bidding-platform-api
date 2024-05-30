const { validationResult } = require('express-validator');
const Bid = require('../models/Bid');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { io } = require('../index');
const { Op } = require('sequelize');

exports.getAllBids = async (req, res) => {
  try {
    const bids = await Bid.findAll({ where: { item_id: req.params.itemId } });
    res.status(200).json(bids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.placeBid = async (req, res, io) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { bid_amount } = req.body;
  const userId = req.user.id;
  const itemId = req.params.itemId;

  try {
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    if (bid_amount <= item.current_price) {
      return res.status(400).json({ msg: 'Bid amount must be higher than current price' });
    }

    const bid = await Bid.create({
      item_id: itemId,
      user_id: userId,
      bid_amount,
      created_at: new Date(),
    });

    await item.update({ current_price: bid_amount });

    await Notification.create({
      user_id: userId,
      message: `Congratulations, you are now the highest bidder on "${item.name}" with a bid of $${bid_amount}.`,
    });

    io.to(userId).emit('notify', `Congratulations, you are now the highest bidder on "${item.name}" with a bid of $${bid_amount}.`);

    const previousBidders = await Bid.findAll({
      where: {
        item_id: itemId,
        user_id: {
          [Op.ne]: userId,
        },
      },
    });

    for (const bid of previousBidders) {
      await Notification.create({
        user_id: bid.user_id,
        message: `You have been outbid on "${item.name}" with a bid of $${bid_amount}.`,
      });

      io.to(bid.user_id).emit('notify', `You have been outbid on "${item.name}" with a bid of $${bid_amount}.`);
    }

    return res.status(201).json(bid);
  } catch (err) {
    console.log("Error placing bid: ", err);
    return res.status(500).json({ error: err.message });
  }
};