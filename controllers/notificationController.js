const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({ where: { user_id: req.user.id } });
    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.update({ is_read: true }, { where: { user_id: req.user.id } });
    return res.status(200).json({ msg: 'Notifications marked as read' });
  } catch (err) {
    console.log("Error marking as read: ", err);
    return res.status(500).json({ error: err.message });
  }
};