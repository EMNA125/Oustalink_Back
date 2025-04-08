const express = require('express');
const categoryController = require('../Controllers/categoriesController');
const router = express.Router();

// CRUD Routes
router.post('/create', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

// Additional Functionality
router.get('/search/title', categoryController.getCategoriesByTitle); // Get by title
router.get('/filter', categoryController.filterCategories);           // Filter categories
router.get('/service-type', categoryController.getCategoriesByServiceType); // Get by service type

module.exports = router;