const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(payloadThread) {
    const { title, body, owner } = payloadThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyThreadAvailability(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('ID tidak ditemukan');
    }
    return result.rows;
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT threads.id, threads.title, threads.body, threads.created_at AS date, users.username FROM threads LEFT JOIN users on users.id = threads.owner WHERE threads.id = $1 ORDER BY threads.created_at',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('ID tidak ditemukan');
    }
    return new ThreadDetail({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
