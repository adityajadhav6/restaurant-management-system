const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Enforce unique table names
  },
  status: {
    type: String,
    default: 'vacant',
  },
  orders: {
    type: Array,
    default: [],
  },
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
