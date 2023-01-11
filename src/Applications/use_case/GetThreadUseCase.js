const CommentDetail = require('../../Domains/comments/entities/CommentDetail');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const commentsRaw = await this._commentRepository.getCommentsByThread(threadId);

    const commentDetail = new CommentDetail();
    await Promise.all(commentsRaw.map(async (v) => {
      const payload = {
        ...v,
        replies: await this._replyRepository.getRepliesByComment(v.id),
      };

      commentDetail._addComment(payload);
    }));

    const comments = commentDetail._getComments();

    thread._addComments(comments);

    return thread;
  }
}

module.exports = GetThreadUseCase;
