const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(payloadComment) {
    const {
      threadId, commentId, content, owner,
    } = payloadComment;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date();
    const isdelete = false;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, threadId, commentId, content, owner, date, isdelete],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(replyId) {
    const isdelete = true;

    const query = {
      text: 'UPDATE replies SET is_delete = $2 WHERE id = $1',
      values: [replyId, isdelete],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Balasan gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyReplyAvailability(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }
    return result.rows;
  }

  async getRepliesByComment(commentId) {
    const query = {
      text: 'SELECT replies.id, replies.content, replies.created_at AS date, users.username, replies.is_delete AS isdelete FROM replies LEFT JOIN users ON users.id = replies.owner WHERE comment_id = $1 ORDER BY replies.created_at',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyReplyOwner(userId, replyId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    const reply = result.rows[0];
    if (reply.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
