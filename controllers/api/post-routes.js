const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Post, User, Vote, Comment } = require("../../models");

// Get all users
router.get("/", (req, res) => {
    console.log("---------------------");
    Post.findAll({
        order: [["created_at", "DESC"]],
        attributes: [
            "id",
            "post_url",
            "title",
            "created_at",
            [
                sequelize.literal(
                    "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
                ),
                "vote_count",
            ],
        ],
        include: [
            {
                model: Comment, //comment model also includes User model so it can attach a username to the comment
                attributes: [
                    "id",
                    "comment_text",
                    "post_id",
                    "user_id",
                    "created_at",
                ],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
            {
                model: User,
                attributes: ["username"],
            },
        ],
    })
        .then((dbPostData) => res.json(dbPostData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get a single post
router.get("/:id", (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: [
            "id",
            "post_url",
            "title",
            "created_at",
            [
                sequelize.literal(
                    "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
                ),
                "vote_count",
            ],
        ],
        include: [
            {
                model: Comment,
                attributes: [
                    "id",
                    "comment_text",
                    "post_id",
                    "user_id",
                    "created_at",
                ],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
            {
                model: User,
                attributes: ["username"],
            },
        ],
    })
        .then((dbPostData) => {
            if (!dbPostData) {
                res.status(404).json({ message: "No post found with this id" });
                return;
            }
            res.json(dbPostData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Create a post
router.post("/", (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id,
    })
        .then((dbPostData) => res.json(dbPostData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Put /api/posts/upvote
router.put("/upvote", (req, res) => {
    // make sure session exists first
    if (req.session) {
        // pass session id along with all destructured properties on req.body
        Post.upvote(
            // custom static method created in models/Post.js
            { ...req.body, user_id: req.session.user_id },
            { Vote, Comment, User }
        )
            .then((updatedVoteData) => res.json(updatedVoteData))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});
// must go above router.put("/:id") or else server will think "upvote" is a valid parameter for /:id

// Update title
router.put("/:id", (req, res) => {
    Post.update(
        {
            title: req.body.title,
        },
        {
            where: {
                id: req.params.id,
            },
        }
    )
        .then((dbPostData) => {
            if (!dbPostData) {
                res.status(404).json({ message: "No post found with this id" });
                return;
            }
            res.json(dbPostData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Delete a post
router.delete("/:id", (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then((dbPostData) => {
            if (!dbPostData) {
                res.status(404).json({ message: "No post found with this id" });
                return;
            }
            res.json(dbPostData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
