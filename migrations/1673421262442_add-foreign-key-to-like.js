/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addConstraint('likes', 'fk_likes.thread_id_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');

  pgm.addConstraint('likes', 'fk_likes.comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');

  pgm.addConstraint('likes', 'fk_likes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('likes', 'fk_likes.thread_id_threads.id');

  pgm.dropConstraint('likes', 'fk_likes.comment_id_comments.id');

  pgm.dropConstraint('likes', 'fk_likes.owner_users.id');
};
