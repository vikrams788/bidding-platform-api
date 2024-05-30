const { validationResult } = require('express-validator');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const Bid = require('../models/Bid');
const User = require('../models/User');

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    return res.status(200).json(items);
  } catch (err) {
    console.log("Error getting all items: ", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    return res.status(200).json(item);
  } catch (err) {
    console.log("Error getting item by Id: ", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.createItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, starting_price, end_time } = req.body;
  const image_url = req.file ? req.file.path : null;

  try {
    const item = await Item.create({
      name,
      description,
      starting_price,
      current_price: starting_price,
      image_url,
      end_time,
      created_at: new Date(),
    });
    return res.status(201).json(item);
  } catch (err) {
    console.log("Error creating item: ", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    const { name, description, starting_price, end_time } = req.body;
    const image_url = req.file ? req.file.path : item.image_url;

    await item.update({
      name,
      description,
      starting_price,
      end_time,
      image_url,
    });

    return res.status(200).json(item);
  } catch (err) {
    console.log("Error updating item: ", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    await item.destroy();
    return res.status(200).json({ msg: 'Item deleted' });
  } catch (err) {
    console.log("Error deleting item: ", err);
    return res.status(500).json({ error: err.message });
  }
};