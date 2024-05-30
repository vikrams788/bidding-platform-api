const { validationResult } = require('express-validator');
const Bid = require('../models/Bid');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { io } = require('../index');

exports.getAllBids = async (req, res) => {
  try {
    const bids = await Bid.findAll({ where: { item_id: req.params.itemId } });
    res.status(200).json(bids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.placeBid = async (req, res) => {
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

    // Notify item owner
    const itemOwner = await User.findByPk(item.user_id);
    if (itemOwner) {
      await Notification.create({
        user_id: itemOwner.id,
        message: `Your item "${item.name}" has a new bid of $${bid_amount}.`,
      });

      io.to(itemOwner.id).emit('notify', `Your item "${item.name}" has a new bid of $${bid_amount}.`);
    }

    return res.status(201).json(bid);
  } catch (err) {
    console.log("Error placing bid: ", err);
    return res.status(500).json({ error: err.message });
  }
};