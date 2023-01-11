const PayloadReply = require('../../Domains/replies/entities/PayloadReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const payloadComment = new PayloadReply(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(useCasePayload.threadId);
    await this._commentRepository.verifyCommentAvailability(useCasePayload.commentId);

    return this._replyRepository.addReply(payloadComment);
  }
}

module.exports = AddReplyUseCase;
