const express = require('express');
const router = express.Router();
const replyController = require('../Controllers/replyController');

// Create a new reply
router.post('/create', replyController.create);

// Get all replies
router.get('/getall', replyController.getAll);

// Get a reply by its ID
router.get('/comment/:id', replyController.getById);

// Update a reply by its ID
router.put('/comment/:id', replyController.update);

// Delete a reply by its ID
router.delete('/:id', replyController.delete);

module.exports = router;
