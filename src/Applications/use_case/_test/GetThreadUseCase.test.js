const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating the add thread with no reply', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const date = new Date();
    const expectedThread = new ThreadDetail({
      id: threadId,
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date,
      username: 'admin',
    });

    const payloadComments = {
      id: commentId,
      content: 'new comment',
      date,
      username: 'admin',
      isdelete: false,
      replies: [],
    };

    const expectedComments = new CommentDetail();
    expectedComments._addComment(payloadComments);
    expectedThread._addComments(expectedComments._getComments());

    const expectedReplies = [];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new ThreadDetail({
        id: 'thread-123',
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        date,
        username: 'admin',
      })));
    mockCommentRepository.getCommentsByThread = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'comment-123',
        content: 'new comment',
        date,
        username: 'admin',
        isdelete: false,
      }]));
    mockReplyRepository.getRepliesByComment = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(threadId);

    // Assert
    const { comments: commentsThread } = thread;
    expect(thread).toStrictEqual(expectedThread);
    expect(commentsThread).toStrictEqual(expectedComments._getComments());
    expect(commentsThread[0].replies).toStrictEqual(expectedReplies);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThread).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByComment).toBeCalledWith(commentId);
  });

  it('should orchestrating the add thread with reply', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const date = new Date();
    const expectedThread = new ThreadDetail({
      id: threadId,
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date,
      username: 'admin',
    });

    const payloadComments = {
      id: commentId,
      content: 'new comment',
      date,
      username: 'admin',
      isdelete: false,
      replies: [{
        id: replyId,
        content: 'new reply',
        date,
        username: 'admin',
        isdelete: false,
      }],
    };

    const expectedComments = new CommentDetail();
    expectedComments._addComment(payloadComments);
    expectedThread._addComments(expectedComments._getComments());

    const expectedReplies = [{
      id: replyId,
      content: 'new reply',
      date,
      username: 'admin',
    }];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new ThreadDetail({
        id: 'thread-123',
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        date,
        username: 'admin',
      })));
    mockCommentRepository.getCommentsByThread = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'comment-123',
        content: 'new comment',
        date,
        username: 'admin',
        isdelete: false,
      }]));
    mockReplyRepository.getRepliesByComment = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'reply-123',
        content: 'new reply',
        date,
        username: 'admin',
        isdelete: false,
      }]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(threadId);

    // Assert
    const { comments: commentsThread } = thread;
    expect(thread).toStrictEqual(expectedThread);
    expect(commentsThread).toStrictEqual(expectedComments._getComments());
    expect(commentsThread[0].replies).toStrictEqual(expectedReplies);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThread).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByComment).toBeCalledWith(commentId);
  });
});
