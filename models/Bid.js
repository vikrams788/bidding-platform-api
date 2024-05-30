const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Item = require('./Item');
const User = require('./User');

const Bid = sequelize.define('bid', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    item_id: {
        type: DataTypes.UUID,
        references: {
        model: Item,
        key: 'id',
        },
    },
    user_id: {
        type: DataTypes.UUID,
        references: {
        model: User,
        key: 'id',
        },
    },
    bid_amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    }, {
    timestamps: false,
});

module.exports = Bid;