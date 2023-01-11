class CommentDetail {
  constructor() {
    this.comments = [];
  }

  _verifyPayload({
    id, username, date, content, isdelete, likeCount, replies,
  }) {
    if (!id || !username || !date || !content || isdelete === undefined || likeCount === undefined || !replies) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || date instanceof Date === false || typeof content !== 'string' || typeof isdelete !== 'boolean' || typeof likeCount !== 'number') {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (Array.isArray(replies) !== true) throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    replies.map((v) => {
      if ((typeof v !== 'undefined' && typeof v !== 'object') || Array.isArray(v) === true) throw new Error('COMMENT_DETAIL.REPLIES_NOT_MEET_DATA_TYPE_SPECIFICATION');

      if (!v.id || !v.date || !v.content || !v.username || v.isdelete === undefined) {
        throw new Error('COMMENT_DETAIL.REPLIES_ELEMENT_NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof v.id !== 'string' || v.date instanceof Date === false || typeof v.content !== 'string' || typeof v.username !== 'string' || typeof v.isdelete !== 'boolean') {
        throw new Error('COMMENT_DETAIL.REPLIES_ELEMENT_NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    });
  }

  _addComment(payload) {
    this._verifyPayload(payload);
    const {
      id, username, date, content, isdelete, likeCount, replies,
    } = payload;

    this.comments.push({
      id,
      username,
      date,
      replies: replies.map((v) => ({
        id: v.id,
        content: (v.isdelete) ? '**balasan telah dihapus**' : v.content,
        date: v.date,
        username: v.username,
      })),
      content: (isdelete) ? '**komentar telah dihapus**' : content,
      likeCount,
    });
  }

  _getComments() {
    return this.comments;
  }
}

module.exports = CommentDetail;
