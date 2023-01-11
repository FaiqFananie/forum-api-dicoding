const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'PAYLOAD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'PAYLOAD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan id, title dan owner'),
  'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('id, title dan owner harus string'),
  'PAYLOAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'),
  'PAYLOAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat komentar baru karena tipe data tidak sesuai'),
  'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan id, content dan owner'),
  'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('id, content dan owner harus string'),
  'COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('comment harus mengirimkan id, username, date, content dan isdelete'),
  'COMMENT_DETAIL.REPLIES_ELEMENT_NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('reply harus mengirimkan id, date, content, username dan isdelete'),
  'COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('comment id, username, date, content harus string, isdelete harus boolean, replies harus array'),
  'COMMENT_DETAIL.REPLIES_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('reply elemen harus object'),
  'COMMENT_DETAIL.REPLIES_ELEMENT_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('reply id, date, content, username harus string dan isdelete harus boolean'),
  'THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('thread harus mengirimkan id, title, body, date dan username'),
  'THREAD_DETAIL.COMMENTS_ELEMENT_NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('comment harus mengirimkan id, username, date, content dan replies'),
  'THREAD_DETAIL.COMMENTS_REPLIES_ELEMENT_NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('reply harus mengirimkan id, content, date dan username'),
  'THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('thread id, title, body, date dan username harus string'),
  'THREAD_DETAIL.COMMENTS_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('comments harus array'),
  'THREAD_DETAIL.COMMENTS_ELEMENT_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('comment id, username, date, content harus string dan replies harus array'),
  'THREAD_DETAIL.COMMENTS_REPLIES_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('replies elemen harus object'),
  'THREAD_DETAIL.COMMENTS_REPLIES_ELEMENT_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('reply id, content, date username harus string'),
  'PAYLOAD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada'),
  'PAYLOAD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat balasan baru karena tipe data tidak sesuai'),
  'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan id, content dan owner'),
  'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('id, content dan owner harus string'),
};

module.exports = DomainErrorTranslator;
