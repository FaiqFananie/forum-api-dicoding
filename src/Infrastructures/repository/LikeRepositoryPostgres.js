const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(payloadLike) {
    const { threadId, commentId, owner } = payloadLike;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4',
      values: [id, threadId, commentId, owner],
    };

    await this._pool.query(query);
  }

  async deleteLike(payloadLike) {
    const { threadId, commentId, owner } = payloadLike;

    const query = {
      text: 'DELETE FROM likes WHERE thread_id = $1, comment_id = $2, owner = $3',
      values: [threadId, commentId, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Like gagal dihapus. Data tidak ditemukan');
    }
  }
}

module.exports = LikeRepositoryPostgres;
