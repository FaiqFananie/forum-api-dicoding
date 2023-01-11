const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const PayloadLike = require('../../../Domains/likes/entities/PayloadLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist comment payload and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const payload = new PayloadLike({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(payload);

      // Assert
      const like = await LikesTableTestHelper.findLikesById('like-123');
      expect(like).toHaveLength(1);
    });
  });

  describe('deleteLike Function', () => {
    it('should persist comment delete payload correctly', async () => {
      // Arrange
      const userId = await UsersTableTestHelper.addUser({ id: 'user-123' });
      const threadId = await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      const commentId = await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId });
      const likeId = await LikesTableTestHelper.addLike({ id: 'like-123' });

      const payload = new PayloadLike({
        threadId,
        commentId,
        owner: userId,
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      await likeRepositoryPostgres.deleteReply(payload);

      // Assert
      const like = await LikesTableTestHelper.findlikesById(likeId);
      expect(like).toHaveLength(0);
    });

    it('should throw error with statuscode 404 when like is not found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action and Assert
      return expect(likeRepositoryPostgres.deleteLike('like-123'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });
});
