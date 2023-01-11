class ThreadDetail {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, title, body, date, username,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = [];
  }

  _verifyPayload({
    id, title, body, date, username,
  }) {
    if (!id || !title || !body || !date || !username) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof username !== 'string') {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyPayloadComments(comments) {
    if (Array.isArray(comments) !== true) throw new Error('THREAD_DETAIL.COMMENTS_NOT_MEET_DATA_TYPE_SPECIFICATION');
    comments.map((v) => {
      if ((typeof v !== 'undefined' && typeof v !== 'object') || Array.isArray(v) === true) throw new Error('THREAD_DETAIL.COMMENTS_NOT_MEET_DATA_TYPE_SPECIFICATION');

      if (!v.id || !v.username || !v.date || !v.content || !v.replies) {
        throw new Error('THREAD_DETAIL.COMMENTS_ELEMENT_NOT_CONTAIN_NEEDED_PROPERTY');
      }

      if (typeof v.id !== 'string' || typeof v.username !== 'string' || v.date instanceof Date === false || typeof v.content !== 'string' || Array.isArray(v.replies) !== true) {
        throw new Error('THREAD_DETAIL.COMMENTS_ELEMENT_NOT_MEET_DATA_TYPE_SPECIFICATION');
      }

      v.replies.map((w) => {
        if ((typeof w !== 'undefined' && typeof w !== 'object') || Array.isArray(w) === true) throw new Error('THREAD_DETAIL.COMMENTS_REPLIES_NOT_MEET_DATA_TYPE_SPECIFICATION');

        if (!w.id || !w.content || !w.date || !w.username) {
          throw new Error('THREAD_DETAIL.COMMENTS_REPLIES_ELEMENT_NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof w.id !== 'string' || w.date instanceof Date === false || typeof w.content !== 'string' || typeof w.username !== 'string') {
          throw new Error('THREAD_DETAIL.COMMENTS_REPLIES_ELEMENT_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
      });
    });
  }

  _addComments(comments) {
    this._verifyPayloadComments(comments);
    this.comments = comments;
  }
}

module.exports = ThreadDetail;
