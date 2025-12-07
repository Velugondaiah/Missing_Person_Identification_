const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

// Mock database for unknown person reports (replace with actual database in production)
let reports = [];

// @route   POST /unknown-person
// @desc    Report an unknown person sighting
// @access  Private
router.post('/unknown-person', auth, (req, res) => {
  try {
    const { photoURL, location, dateTime, description } = req.body;
    
    // Validate input
    if (!photoURL) {
      return res.status(400).json({ message: 'Photo is required' });
    }
    
    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }
    
    // Create new report
    const newReport = {
      id: Date.now().toString(),
      user: req.user.id,
      photoURL,
      location,
      dateTime: dateTime || new Date().toISOString(),
      description,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Save report to database
    reports.push(newReport);
    
    // Log the Cloudinary URL for debugging
    console.log('Received photo URL:', photoURL);
    
    res.status(201).json({
      success: true,
      report: newReport,
      message: 'Sighting reported successfully'
    });
    
  } catch (error) {
    console.error('Error reporting unknown person:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /unknown-person
// @desc    Get all unknown person reports for a user
// @access  Private
router.get('/unknown-person', auth, (req, res) => {
  try {
    const userReports = reports.filter(report => report.user === req.user.id);
    
    // Sort by date (newest first)
    userReports.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    
    res.json(userReports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /unknown-person/:id
// @desc    Get a specific unknown person report
// @access  Private
router.get('/unknown-person/:id', auth, (req, res) => {
  try {
    const report = reports.find(r => r.id === req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if user owns the report or is an admin
    if (report.user !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this report' });
    }
    
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /unknown-person/:id
// @desc    Update a report status (for admins/police)
// @access  Private (Admin/Police)
router.put('/unknown-person/:id', auth, (req, res) => {
  try {
    // Check if user is admin or police
    if (req.user.role !== 'admin' && req.user.role !== 'police') {
      return res.status(403).json({ message: 'Not authorized to update report status' });
    }
    
    const { status, notes } = req.body;
    
    const reportIndex = reports.findIndex(r => r.id === req.params.id);
    
    if (reportIndex === -1) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Update report
    if (status) reports[reportIndex].status = status;
    if (notes) reports[reportIndex].adminNotes = notes;
    
    // Add status update history
    if (!reports[reportIndex].statusHistory) {
      reports[reportIndex].statusHistory = [];
    }
    
    reports[reportIndex].statusHistory.push({
      status: status || reports[reportIndex].status,
      updatedBy: req.user.id,
      notes,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      report: reports[reportIndex],
      message: 'Report updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;