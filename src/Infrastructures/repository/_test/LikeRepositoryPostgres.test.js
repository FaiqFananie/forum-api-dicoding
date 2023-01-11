const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const PayloadLike = require('../../../Domains/likes/entities/PayloadLike');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
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
    it('should persist like delete payload correctly', async () => {
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
      await likeRepositoryPostgres.deleteLike(payload);

      // Assert
      const like = await LikesTableTestHelper.findLikesById(likeId);
      expect(like).toHaveLength(0);
    });
  });

  describe('getLike Function', () => {
    it('should return 1 if like comment is found', async () => {
      // Arrange
      const userId = await UsersTableTestHelper.addUser({ id: 'user-123' });
      const threadId = await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      const commentId = await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId });
      await LikesTableTestHelper.addLike({ id: 'like-123' });

      const payload = new PayloadLike({
        threadId,
        commentId,
        owner: userId,
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.getLike(payload);

      // Assert
      expect(like).toStrictEqual(1);
    });

    it('should return 0 if like comment is not found', async () => {
      // Arrange
      const payload = new PayloadLike({
        threadId: 'thread-123',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.getLike(payload);

      // Action and Assert
      expect(like).toStrictEqual(0);
    });
  });

  describe('getLike Function', () => {
    it('should return more than 0 if like comment is found', async () => {
      // Arrange
      const userId = await UsersTableTestHelper.addUser({ id: 'user-123' });
      const threadId = await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      const commentId = await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId });
      await LikesTableTestHelper.addLike({ id: 'like-123' });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.getLikes(threadId, commentId);

      // Assert
      expect(like).toStrictEqual(1);
    });

    it('should return 0 if like comment is not found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.getLikes('thread-123', 'comment-123');

      // Assert
      expect(like).toStrictEqual(0);
    });
  });
});
