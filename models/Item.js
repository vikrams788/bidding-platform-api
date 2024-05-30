const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Item = sequelize.define('item', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    starting_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    current_price: {
        type: DataTypes.DECIMAL,
        defaultValue: 0.0,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    }, {
    timestamps: false,
});

module.exports = Item;