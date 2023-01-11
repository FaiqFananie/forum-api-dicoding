class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(userId, replyId) {
    await this._replyRepository.verifyReplyAvailability(replyId);
    await this._replyRepository.verifyReplyOwner(userId, replyId);
    return this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
