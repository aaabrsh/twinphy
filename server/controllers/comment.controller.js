const { Comment } = require("../models/comment.model");
const { Post } = require("../models/post.model");

module.exports.getComments = async (req, res, next) => {
  try {
    const { parentId } = req.params;
    let { comment_for, pageSize, lastDate, lastCommentId } = req.query;

    if (!comment_for) {
      return res.status(400).json({ message: "comment_for must be provided" });
    } else if (comment_for !== "post" && comment_for !== "comment") {
      return res
        .status(400)
        .json({ message: "invalid comment_for value provided" });
    }

    if (!pageSize) pageSize = 10;

    const comments_list = await Comment.getComments(
      comment_for,
      parentId,
      lastDate,
      lastCommentId,
      pageSize
    );

    const comments = comments_list.map((c) => {
      const temp = { ...c.toObject() };
      temp.has_reply = c.comments.length > 0;
      temp.is_liked = c.likes.length > 0;
      delete temp.comments;
      delete temp.likes;
      return temp;
    });

    let newLastDate = lastDate;
    let newLastCommentId = lastCommentId;

    if (comments.length > 0) {
      newLastDate = comments[comments.length - 1].createdAt.toISOString();
      newLastCommentId = comments[comments.length - 1]._id.toString();
    }

    res.status(200).json({
      data: comments,
      pageSize,
      lastDate: newLastDate,
      lastCommentId: newLastCommentId,
    });
  } catch (e) {
    next(e);
  }
};

module.exports.createComment = async (req, res, next) => {
  try {
    const { content, comment_for, parentId, reply_for } = req.body;
    const { _id: author } = req.user;

    // validations
    if (!content || content.length === 0) {
      return res.status(400).json({ message: "content is required" });
    } else if (!parentId) {
      return res.status(400).json({ message: "parent id is required" });
    } else if (comment_for !== "post" && comment_for !== "comment") {
      return res
        .status(400)
        .json({ message: "invalid comment_for value provided" });
    } else if (comment_for === "comment" && !reply_for) {
      return res
        .status(400)
        .json({ message: "a reply for comments must include reply_for field" });
    }

    let comment;

    if (comment_for === "post") {
      // create a comment for a post

      const parent_post = await Post.findById(parentId);
      if (!parent_post)
        return res.status(404).json({ message: "parent post not found" });

      comment = new Comment({
        content,
        comment_for,
        parent_post: parentId,
        author,
      });
      await comment.save();
    } else {
      // create a reply for a comment

      const parent_comment = await Comment.findById(parentId);
      if (!parent_comment)
        return res.status(404).json({ message: "parent comment not found" });

      comment = new Comment({
        content,
        comment_for,
        parent_comment: parentId,
        reply_for,
        author,
      });

      await comment.save();
      parent_comment.comments.push(comment._id);
      await parent_comment.save();
    }

    return res.status(201).json({ data: comment });
  } catch (e) {
    next(e);
  }
};

module.exports.likeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { _id } = req.user;

    if (!_id || !commentId) {
      return res
        .status(400)
        .json({ message: "both user id and comment id are required" });
    }

    await Comment.like(_id, commentId);
    res.status(200).json({ message: "comment liked successfully" });
  } catch (e) {
    next(e);
  }
};

module.exports.unlikeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { _id } = req.user;

    if (!_id || !commentId) {
      return res
        .status(400)
        .json({ message: "both user id and comment id are required" });
    }

    await Comment.unlike(_id, commentId);
    res.status(200).json({ message: "comment unliked successfully" });
  } catch (e) {
    next(e);
  }
};
