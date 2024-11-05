const express = require('express');
const router = express.Router();
const legiscanService = require('../services/legiscanService');

router.get('/bills/search', async (req, res) => {
  try {
    const { query = 'active', state = 'US' } = req.query;
    const results = await legiscanService.searchBills(query, state);
    res.json(results);
  } catch (error) {
    console.error('Error in /bills/search:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/bills/:id', async (req, res) => {
  try {
    const bill = await legiscanService.getBill(req.params.id);
    res.json(bill);
  } catch (error) {
    console.error('Error in /bills/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/officials/:id/votes', async (req, res) => {
  try {
    const votes = await legiscanService.getOfficialVotes(req.params.id);
    res.json(votes);
  } catch (error) {
    console.error('Error in /officials/:id/votes:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;