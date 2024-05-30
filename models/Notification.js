const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const User = require('./User');

const Notification = sequelize.define('notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        references: {
        model: User,
        key: 'id',
        },
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    }, {
    timestamps: false,
});

module.exports = Notification;