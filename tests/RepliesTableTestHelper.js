/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', threadId = 'thread-123', commentId = 'comment-123', content = 'Dicoding Indonesia', owner = 'user-123', createdAt = new Date(), isdelete = false,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, threadId, commentId, content, owner, createdAt, isdelete],
    };

    const result = await pool.query(query);

    return result.rows[0].id;
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
