const categoryService = require('../Services/categoriesService');

const categoryController = {
    async createCategory(req, res) {
        try {
            const { title, service_types } = req.body;
            const newCategory = await categoryService.createCategory(title, service_types);
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await categoryService.getCategoryById(id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { title, service_types } = req.body;
            const updatedCategory = await categoryService.updateCategory(id, title, service_types);
            if (!updatedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json(updatedCategory);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const result = await categoryService.deleteCategory(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getCategoriesByTitle(req, res) {
        try {
            const { title } = req.query;
            if (!title) {
                return res.status(400).json({ message: 'Please provide a title to search for.' });
            }
            const categories = await categoryService.getCategoriesByTitle(title);
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async filterCategories(req, res) {
        try {
            const filters = req.query;
            const filteredCategories = await categoryService.filterCategories(filters);
            res.status(200).json(filteredCategories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getCategoriesByServiceType(req, res) {
        try {
            const { serviceType } = req.query;
            if (!serviceType) {
                return res.status(400).json({ message: 'Please provide a serviceType to search for.' });
            }
            const categories = await categoryService.getCategoriesByServiceType(serviceType);
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = categoryController;