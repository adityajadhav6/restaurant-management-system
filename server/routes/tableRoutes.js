const express = require('express');
const router = express.Router();
const Table = require('../models/Table'); // Import the Table model

// GET all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

// GET a specific table by name
router.get('/name/:name', async (req, res) => {
  try {
    const table = await Table.findOne({ name: req.params.name });
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch table by name' });
  }
});

// POST new table
router.post('/', async (req, res) => {
  try {
    const newTable = new Table(req.body);
    const saved = await newTable.save();
    res.json(saved);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Table name must be unique' });
    } else {
      res.status(500).json({ error: 'Failed to create table' });
    }
  }
});

// PATCH (update specific fields of a table by ID)
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update table' });
  }
});

// DELETE a specific table by ID
router.delete('/:id', async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: 'Table deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete table' });
  }
});

// DELETE a specific table by name
router.delete('/name/:name', async (req, res) => {
  try {
    const deletedTable = await Table.findOneAndDelete({ name: req.params.name });
    if (!deletedTable) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json({ message: 'Table deleted by name', table: deletedTable });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete table by name' });
  }
});

// DELETE all tables
router.delete('/', async (req, res) => {
  try {
    await Table.deleteMany({});
    res.json({ message: 'All tables deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete all tables' });
  }
});

module.exports = router;
