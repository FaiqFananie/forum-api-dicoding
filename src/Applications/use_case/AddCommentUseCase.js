const PayloadComment = require('../../Domains/comments/entities/PayloadComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const payloadComment = new PayloadComment(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(useCasePayload.threadId);

    return this._commentRepository.addComment(payloadComment);
  }
}

module.exports = AddCommentUseCase;
