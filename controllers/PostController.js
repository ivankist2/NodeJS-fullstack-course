import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Unable to get list of posts',
        })
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);
        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Unable to get list of posts',
        })
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            }
        ).populate('user').exec().then((doc) => {
            if (!doc) {
                return res.status(404).json({
                    message: 'Post not found',
                });
            }

            res.json(doc);
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                message: 'Unable to get post',
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Unable to get post',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId,
        }).then((doc) => {
            if (!doc) {
                return res.status(404).json({
                    message: 'Post not found',
                });
            }
            res.json({
                success: true,
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Failed in removing process',
            });
        }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Unable to remove post',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.replace(' ', '').split(','),
            user: req.userId,
            imageUrl: req.body.imageUrl,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'The post hasn\' been created',
        })
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags.replace(' ', '').split(','),
                // user: req.userId, // only owner can edit post
                imageUrl: req.body.imageUrl,
            }
        );

        res.json({
            success: true
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update post',
        })
    }
}