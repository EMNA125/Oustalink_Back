const express = require('express');
const router = express.Router();
const commentController = require('../Controllers/commentController');

router.post('/create', commentController.create);
router.get('/comments', commentController.getAll);
router.get('/comment/:id', commentController.getById);
router.put('comment/:id', commentController.update);
router.delete('/:id', commentController.delete);

module.exports = router;
