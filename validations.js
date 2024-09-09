import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Invalid mail address').isEmail(),
    body('password', 'The password must contain at least 5 characters').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'Invalid mail address').isEmail(),
    body('password', 'The password must contain at least 5 characters').isLength({ min: 5 }),
    body('fullName', 'Enter name').isLength({ min: 3 }),
    body('avatarUrl', 'Invalid avatar URL').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Enter post title').isLength({ min: 3 }).isString(),
    body('text', 'Enter post text').isLength({ min: 3 }).isString(),
    body('tags', 'Invalid tags format (enter array)').optional().isString(),
    body('imageUrl', 'Invalid image reference').optional(),
];