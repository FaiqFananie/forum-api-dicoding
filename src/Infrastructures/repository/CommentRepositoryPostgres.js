const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(payloadComment) {
    const { threadId, content, owner } = payloadComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date();
    const isdelete = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, content, owner, date, isdelete],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId) {
    const isdelete = true;

    const query = {
      text: 'UPDATE comments SET is_delete = $2 WHERE id = $1',
      values: [commentId, isdelete],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komentar gagal dihapus. Id tidak ditemukan');
    }
  }

  async getCommentsByThread(threadId) {
    const query = {
      text: 'SELECT comments.id, comments.content, comments.created_at AS date, comments.is_delete AS isdelete, users.username FROM comments LEFT JOIN users ON users.id = comments.owner WHERE comments.thread_id = $1 ORDER BY comments.created_at',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyCommentAvailability(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
    return result.rows;
  }

  async verifyCommentOwner(userId, commentId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    const comment = result.rows[0];
    if (comment.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = CommentRepositoryPostgres;
