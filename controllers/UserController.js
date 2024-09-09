import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import UserModel from '../models/User.js';
import { validationResult } from 'express-validator';

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const password = req.body.password;
        const hash = await argon2.hash(password);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Registration failed',
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email, });

        if (!user) {
            return res.status(404).json({
                message: 'The user is not find.',
            })
        }

        const isValidPass = await argon2.verify(user._doc.passwordHash, req.body.password);

        if (!isValidPass) {
            return res.status(404).json({
                message: 'The email or password is not correct.',
            })
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to login',
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user)
            return res.status(404).json({
                message: 'User not found',
            });

        const { passwordHash, ...userData } = user._doc;

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed loading',
        });
    }
};


