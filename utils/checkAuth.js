import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';
import PostModel from '../models/Post.js';

export const checkAuth = async (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            const user = await UserModel.findById(decoded._id);
            if (!user) {
                return res.status(404).json({
                    message: 'Access denied. User not found.',
                });
            }
            req.userId = decoded._id;
            next();
        } catch (err) {
            return res.status(403).json({
                message: 'Access denied. Bad token.',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Access denied. There isn\'t token.',
        });
    }
}


export const checkOwner = async (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            const user = await UserModel.findById(decoded._id);
            if (!user) {
                return res.status(404).json({
                    message: 'Access denied. User not found.',
                });
            }
            const owner = await PostModel.findById(req.params.id);

            if (!decoded._id.includes(owner.user._id.toString())) {
                return res.status(403).json({
                    message: 'Access denied. The user can\'t to modify the post.',
                });
            }

            req.userId = decoded._id;
            next();
        } catch (err) {
            return res.status(403).json({
                message: 'Access denied. Bad token.',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Access denied. There isn\'t token.',
        });
    }
}