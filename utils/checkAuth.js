import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

export default async (req, res, next) => {
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