// validators/categoriesValidator.js

const { body, param, query, validationResult } = require('express-validator');

// Validation rules for creating a category
const createCategoryRules = [
    body('title')
        .notEmpty()
        .withMessage('Title is required.')
        .isString()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Title must be between 2 and 100 characters.'),
    body('service_types')
        .isArray({ min: 1 })
        .withMessage('At least one service type must be selected.')
        .custom(types => {
            const allowedTypes = ['MOBILE', 'ONPREMISE', 'ONLINE'];
            return types.every(type => allowedTypes.includes(type));
        })
        .withMessage('Invalid service type(s) provided. Allowed types are MOBILE, ONPREMISE, ONLINE.'),
];

// Validation rules for updating a category
const updateCategoryRules = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid category ID.'),
    body('title')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Title must be between 2 and 100 characters.'),
    body('service_types')
        .optional()
        .isArray({ min: 1 })
        .custom(types => {
            if (!types) return true; // Allow omitting service_types in update
            const allowedTypes = ['MOBILE', 'ONPREMISE', 'ONLINE'];
            return types.every(type => allowedTypes.includes(type));
        })
        .withMessage('Invalid service type(s) provided. Allowed types are MOBILE, ONPREMISE, ONLINE.'),
];

// Validation rule for getting by ID
const getCategoryByIdRules = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Invalid category ID.'),
];

// Validation rule for searching by title
const getCategoriesByTitleRules = [
    query('title')
        .notEmpty()
        .withMessage('Title is required.')
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Title must be at least 2 characters long.'),
];

// Validation rule for filtering categories
const filterCategoriesRules = [
    query('title')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Title must be at least 2 characters long.'),
    query('service_type')
        .optional()
        .isIn(['MOBILE', 'ONPREMISE', 'ONLINE'])
        .withMessage('Invalid service type for filtering.'),
];

// Validation rule for getting by service type
const getCategoriesByServiceTypeRules = [
    query('serviceType')
        .notEmpty()
        .withMessage('Service type is required.')
        .isIn(['MOBILE', 'ONPREMISE', 'ONLINE'])
        .withMessage('Invalid service type.'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    createCategoryRules,
    updateCategoryRules,
    getCategoryByIdRules,
    getCategoriesByTitleRules,
    filterCategoriesRules,
    getCategoriesByServiceTypeRules,
    validate,
};