const PayloadLike = require('../../Domains/likes/entities/PayloadLike');

class AddLikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const payloadLike = new PayloadLike(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(useCasePayload.threadId);
    await this._commentRepository.verifyCommentAvailability(useCasePayload.commentId);

    const like = await this._likeRepository.getLike(payloadLike);
    if (!like) {
      await this._likeRepository.addLike(payloadLike);
    } else {
      await this._likeRepository.deleteLike(payloadLike);
    }
  }
}

module.exports = AddLikeUseCase;
