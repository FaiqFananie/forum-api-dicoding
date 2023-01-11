const CommentDetail = require('../../Domains/comments/entities/CommentDetail');

class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const commentsRaw = await this._commentRepository.getCommentsByThread(threadId);
    const likes = await this._likeRepository.getLikesByThread(threadId);
    const replies = await this._replyRepository.getRepliesByThread(threadId);

    const commentDetail = new CommentDetail();
    await Promise.all(commentsRaw.map(async (v) => {
      const payload = {
        ...v,
        likeCount: likes.filter((x) => x.comment_id === v.id).length,
        replies: replies.filter((x) => x.comment_id === v.id),
      };

      commentDetail._addComment(payload);
    }));

    const comments = commentDetail._getComments();

    thread._addComments(comments);

    return thread;
  }
}

module.exports = GetThreadUseCase;
