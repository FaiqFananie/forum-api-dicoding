/* eslint-disable max-len */
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const PayloadComment = require('../../../Domains/comments/entities/PayloadComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist comment payload and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      const payload = new PayloadComment({
        threadId: 'thread-123',
        content: 'Dicoding Indonesia',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(payload);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'Dicoding Indonesia',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteComment Function', () => {
    it('should persist comment delete payload correctly', async () => {
      // Arrange
      const userId = await UsersTableTestHelper.addUser({ id: 'user-123' });
      const threadId = await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      const commentId = await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comment).toHaveLength(1);
      expect(comment[0].is_delete).toEqual(true);
    });

    it('should throw error with statuscode 404 when comment is not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      return expect(commentRepositoryPostgres.deleteComment('comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('getCommentsByThread', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThread('thread-123');

      // Assert
      expect(Array.isArray(comments)).toEqual(true);
      expect(comments.length).toEqual(0);
    });

    it('should return id when comment is found', async () => {
      // Arrange
      const payload = {
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'Dicoding Indonesia',
        owner: 'user-123',
        createdAt: new Date(),
        isdelete: false,
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'admin' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment(payload);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThread('thread-123');

      // Assert
      expect(Array.isArray(comments)).toEqual(true);
      expect(comments.length).toEqual(1);
      expect(comments[0].id).toEqual(payload.id);
      expect(comments[0].content).toEqual(payload.content);
      expect(comments[0].date).toEqual(payload.createdAt);
      expect(comments[0].isdelete).toEqual(payload.isdelete);
      expect(comments[0].username).toEqual('admin');
    });
  });

  describe('verifyCommentAvailability', () => {
    it('should throw NotFoundError when comment not found', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return id when comment is found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });

      // Action & Assert
      const comments = await commentRepositoryPostgres.verifyCommentAvailability('comment-123');
      expect(Array.isArray(comments)).toEqual(true);
      expect(comments.length).toEqual(1);
      expect(comments[0].id).toEqual('comment-123');
    });
  });

  describe('verifyCommentOwner', () => {
    it('should throw AuthorizationError when comment owner is not match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyCommentOwner('user-1234', 'comment-123'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should return id when thread is found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyCommentOwner('user-123', 'comment-123'))
        .resolves.not.toThrow(AuthorizationError);
    });
  });
});
