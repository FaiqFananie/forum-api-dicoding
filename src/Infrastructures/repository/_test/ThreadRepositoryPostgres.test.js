const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const PayloadThread = require('../../../Domains/threads/entities/PayloadThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist thread payload and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      const payload = new PayloadThread({
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(payload);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'dicoding',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadAvailability', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.verifyThreadAvailability('thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return id when thread is found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      // Action & Assert
      const threads = await threadRepositoryPostgres.verifyThreadAvailability('thread-123');
      expect(Array.isArray(threads)).toEqual(true);
      expect(threads.length).toEqual(1);
      expect(threads[0].id).toEqual('thread-123');
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadById('thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return thread data when thread is found', async () => {
      // Arrange
      const payload = {
        id: 'thread-123',
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        createdAt: new Date(),
        owner: 'user-123',
      };

      // Action
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'admin' });
      await ThreadsTableTestHelper.addThread(payload);

      // Action & Assert
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');
      expect(typeof thread).toEqual('object');
      expect(thread.id).toEqual(payload.id);
      expect(thread.title).toEqual(payload.title);
      expect(thread.body).toEqual(payload.body);
      expect(thread.date).toEqual(payload.createdAt);
      expect(thread.username).toEqual('admin');
      expect(thread.comments).toEqual([]);
    });
  });
});
