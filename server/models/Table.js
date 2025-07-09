const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  type:{
    type: String,
    enum: ['round', 'rect'],
    //required: true,
  },

  status: {
    type: String,
    enum: ['reservation', 'occupied', 'vacant'],
    default: 'vacant',
  },
  orders: [
    {
      item: {
        type: String,
        enum: ['pizza', 'soda', 'juice', 'burger', 'pasta', 'water'],
        required: true,
      },
      quantity: {
        type: Number,
        min: 1,
        required: true,
      },
    },
  ],
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
