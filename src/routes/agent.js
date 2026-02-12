const express = require('express');
const sofiaAgent = require('../agent/sofia');

const router = express.Router();

/**
 * Get agent information
 */
router.get('/info', async (req, res) => {
  try {
    const info = sofiaAgent.getInfo();
    res.json(info);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Process agent request
 */
router.post('/process', async (req, res) => {
  try {
    const result = await sofiaAgent.processRequest(req.body);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Create a new ticket
 */
router.post('/tickets', async (req, res) => {
  try {
    const result = await sofiaAgent.processRequest({
      action: 'createTicket',
      data: req.body,
    });
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Get ticket by ID
 */
router.get('/tickets/:ticketId', async (req, res) => {
  try {
    const result = await sofiaAgent.processRequest({
      action: 'getTicket',
      data: { ticketId: req.params.ticketId },
    });
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Assign ticket to a technician
 */
router.put('/tickets/:ticketId/assign', async (req, res) => {
  try {
    const result = await sofiaAgent.processRequest({
      action: 'assignTicket',
      data: {
        ticketId: req.params.ticketId,
        technicianName: req.body.technicianName,
        subject: req.body.subject,
      },
    });
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Update ticket status
 */
router.put('/tickets/:ticketId/status', async (req, res) => {
  try {
    const result = await sofiaAgent.processRequest({
      action: 'updateTicketStatus',
      data: {
        ticketId: req.params.ticketId,
        status: req.body.status,
        subject: req.body.subject,
      },
    });
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Search tickets
 */
router.get('/tickets', async (req, res) => {
  try {
    const result = await sofiaAgent.processRequest({
      action: 'searchTickets',
      data: req.query,
    });
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
