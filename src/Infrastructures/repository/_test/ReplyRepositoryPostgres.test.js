const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const PayloadReply = require('../../../Domains/replies/entities/PayloadReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist comment payload and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const payload = new PayloadReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'Dicoding Indonesia',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(payload);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'Dicoding Indonesia',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteReply Function', () => {
    it('should persist comment delete payload correctly', async () => {
      // Arrange
      const userId = await UsersTableTestHelper.addUser({ id: 'user-123' });
      const threadId = await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      const commentId = await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId });
      const replyId = await RepliesTableTestHelper.addReply({ id: 'reply-123', threadId, commentId });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply(replyId);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById(replyId);
      expect(reply).toHaveLength(1);
      expect(reply[0].is_delete).toEqual(true);
    });

    it('should throw error with statuscode 404 when comment is not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      return expect(replyRepositoryPostgres.deleteReply('reply-123'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('getRepliesByComment', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByComment('comment-123');

      // Assert
      expect(Array.isArray(replies)).toEqual(true);
      expect(replies.length).toEqual(0);
    });

    it('should return id when reply is found', async () => {
      // Arrange
      const payload = {
        id: 'reply-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'Dicoding Indonesia',
        owner: 'user-123',
        createdAt: new Date(),
        isdelete: false,
      };
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'admin' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply(payload);

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByComment('comment-123');

      // Assert
      expect(Array.isArray(replies)).toEqual(true);
      expect(replies.length).toEqual(1);
      expect(replies[0].id).toEqual(payload.id);
      expect(replies[0].content).toEqual(payload.content);
      expect(replies[0].date).toEqual(payload.createdAt);
      expect(replies[0].username).toEqual('admin');
      expect(replies[0].isdelete).toEqual(payload.isdelete);
    });
  });

  describe('verifyReplyAvailability', () => {
    it('should throw NotFoundError when comment not found', () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return id when comment is found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', threadId: 'thread-123' });

      // Action & Assert
      const replies = await replyRepositoryPostgres.verifyReplyAvailability('reply-123');
      expect(Array.isArray(replies)).toEqual(true);
      expect(replies.length).toEqual(1);
      expect(replies[0].id).toEqual('reply-123');
    });
  });

  describe('verifyReplyOwner', () => {
    it('should throw AuthorizationError when reply owner is not match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(replyRepositoryPostgres.verifyReplyOwner('user-1234', 'reply-123'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should return id when reply is found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      // Action & Assert
      return expect(replyRepositoryPostgres.verifyReplyOwner('user-123', 'reply-123'))
        .resolves.not.toThrow(AuthorizationError);
    });
  });
});
