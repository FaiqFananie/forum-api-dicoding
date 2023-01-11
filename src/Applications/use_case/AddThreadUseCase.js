const PayloadThread = require('../../Domains/threads/entities/PayloadThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const payloadThread = new PayloadThread(useCasePayload);
    return this._threadRepository.addThread(payloadThread);
  }
}

module.exports = AddThreadUseCase;
