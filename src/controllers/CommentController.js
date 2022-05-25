const Comment = require('../models/Comment.js')

class CommentController {
    async addProductComment(req, res) {
        const newComment = new Comment(req.body)
        const savedComment = await newComment.save()
        res.json(savedComment)
    }
    async getRootComment(req, res) {
        const targetId = req.params.productId
        const getPureId = (id) => {
            return id.toString()
        }
        const comments = await Comment
            .find({ targetId })
            .populate([
                { path: "from", select: "displayName profilePhoto" },
            ])
        const rootCommentIds = comments.map(comment => getPureId(comment._id))
        const childrenCommentCount = await Comment.aggregate([
            { $match: { targetId: { $in: rootCommentIds } } },
            { $group: { _id: "$targetId", totalComments: { $sum: 1 } } }
        ])
        res.status(200).json({
            comments,
            childrenCommentCount
        })
    }
    async getChildrenComment(req, res) {
        const targetId = req.params.commentId
        const childrencomments = await Comment.find({ targetId }).populate([
            { path: "from", select: "displayName profilePhoto" },
            { path: "reply", select: "displayName profilePhoto" }
        ])
        res.status(200).json(childrencomments)
    }
}

module.exports = new CommentController