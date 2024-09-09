import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';

import mongoose from 'mongoose';

import * as Validators from './validations.js';

import { checkAuth, checkOwner, handleValidationErrors } from './utils/index.js';

import { UserController, PostController } from './controllers/index.js';

dotenv.config();

mongoose
    .connect(
        // 'mongodb+srv://matvisiv2:matvisiv2@cluster0.wpnvxf6.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
        // 'mongodb+srv://ivankist2:ivankist2_mongodb.com@cluster0.3effc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
        process.env.MONGODB_URI
    )
    .then(() => console.log('DB Ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file?.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', Validators.loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', Validators.registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, Validators.postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkOwner, PostController.remove);
app.patch('/posts/:id', checkOwner, Validators.postCreateValidation, handleValidationErrors, PostController.update);

app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }

    const url = process.env.SERVER_URL == 'localhost' ? `http://localhost:${process.env.PORT}` : process.env.SERVER_URL;

    return console.log(`Server started on: ${url} (port: ${process.env.PORT})`);
});