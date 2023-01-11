const CommentDetail = require('../CommentDetail');

describe('an CommentDetail entities', () => {
  it('should throw error when payload have wrong data types', () => {
    // Arrang and Action
    const commentDetail = new CommentDetail();

    // Assert
    expect(() => commentDetail._addComment({
      id: 'abc',
      username: 'dicoding',
      date: new Date(),
      content: 'abc',
      isdelete: 'true',
      replies: [],
    })).toThrowError('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => commentDetail._addComment({
      id: 'abc',
      username: 'dicoding',
      date: new Date(),
      content: 'abc',
      isdelete: true,
      replies: 1,
    })).toThrowError('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => commentDetail._addComment({
      id: 'abc',
      username: 'dicoding',
      date: new Date(),
      content: 'abc',
      isdelete: true,
      replies: [1],
    })).toThrowError('COMMENT_DETAIL.REPLIES_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => commentDetail._addComment({
      id: 'abc',
      username: 'dicoding',
      date: new Date(),
      content: 'abc',
      isdelete: true,
      replies: [{
        id: 123,
        date: new Date(),
        content: 'new reply',
        username: 'admin',
        isdelete: true,
      }],
    })).toThrowError('COMMENT_DETAIL.REPLIES_ELEMENT_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when addComment with uncomplete data replies', () => {
    // Arrang and Action
    const commentDetail = new CommentDetail();

    // Action and Assert
    expect(() => commentDetail._addComment({
      id: 'abc',
      username: 'dicoding',
      date: new Date(),
      content: 'abc',
      isdelete: true,
    })).toThrowError('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => commentDetail._addComment({
      id: 'abc',
      username: 'dicoding',
      date: new Date(),
      content: 'abc',
      isdelete: true,
      replies: [{
        id: '123',
        date: new Date(),
        content: 'new reply',
        username: 'admin',
      }],
    })).toThrowError('COMMENT_DETAIL.REPLIES_ELEMENT_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should create CommentDetail when isdelete = true', () => {
    // Arrange
    const payload = {
      id: 'abc',
      username: 'dicoding',
      date: new Date(),
      content: 'abc',
      isdelete: true,
      replies: [],
    };

    // Action
    const commentDetail = new CommentDetail(payload);
    commentDetail._addComment(payload);
    const comments = commentDetail._getComments();

    // Assert
    expect(Array.isArray(comments)).toEqual(true);
    expect(typeof comments[0]).toEqual('object');
    expect(comments[0].id).toEqual(payload.id);
    expect(comments[0].username).toEqual(payload.username);
    expect(comments[0].date).toEqual(payload.date);
    expect(comments[0].content).toEqual('**komentar telah dihapus**');
    expect(comments[0].replies).toEqual(payload.replies);
  });

  it('should create CommentDetail when isdelete = false', () => {
    // Arrange
    const payload = {
      id: 'abc',
      username: 'dicoding',
      date: new Date(),
      content: 'abc',
      isdelete: false,
      replies: [],
    };

    // Action
    const commentDetail = new CommentDetail(payload);
    commentDetail._addComment(payload);
    const comments = commentDetail._getComments();

    // Assert
    expect(Array.isArray(comments)).toEqual(true);
    expect(typeof comments[0]).toEqual('object');
    expect(comments[0].id).toEqual(payload.id);
    expect(comments[0].username).toEqual(payload.username);
    expect(comments[0].date).toEqual(payload.date);
    expect(comments[0].content).toEqual(payload.content);
    expect(comments[0].replies).toEqual(payload.replies);
  });

  it('should create CommentDetail when Reply isdelete = true', () => {
    // Arrange
    const payload = {
      id: 'abc',
      username: 'dicoding',
      date: new Date(),
      content: 'abc',
      isdelete: false,
      replies: [{
        id: '123',
        date: new Date(),
        content: 'new reply',
        username: 'admin',
        isdelete: true,
      }],
    };

    // Action
    const commentDetail = new CommentDetail(payload);
    commentDetail._addComment(payload);
    const comments = commentDetail._getComments();

    // Assert
    expect(Array.isArray(comments)).toEqual(true);
    expect(typeof comments[0]).toEqual('object');
    expect(comments[0].id).toEqual(payload.id);
    expect(comments[0].username).toEqual(payload.username);
    expect(comments[0].date).toEqual(payload.date);
    expect(comments[0].content).toEqual(payload.content);
    expect(Array.isArray(comments[0].replies)).toEqual(true);
    expect(typeof comments[0].replies[0]).toEqual('object');
    expect(comments[0].replies[0].id).toEqual(payload.replies[0].id);
    expect(comments[0].replies[0].date).toEqual(payload.replies[0].date);
    expect(comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
    expect(comments[0].replies[0].username).toEqual(payload.replies[0].username);
  });

  it('should create CommentDetail when isdelete = false', () => {
    // Arrange
    const payload = {
      id: 'abc',
      username: 'dicoding',
      date: new Date(),
      content: 'abc',
      isdelete: false,
      replies: [{
        id: '123',
        date: new Date(),
        content: 'new reply',
        username: 'admin',
        isdelete: false,
      }],
    };

    // Action
    const commentDetail = new CommentDetail(payload);
    commentDetail._addComment(payload);
    const comments = commentDetail._getComments();

    // Assert
    expect(Array.isArray(comments)).toEqual(true);
    expect(typeof comments[0]).toEqual('object');
    expect(comments[0].id).toEqual(payload.id);
    expect(comments[0].username).toEqual(payload.username);
    expect(comments[0].date).toEqual(payload.date);
    expect(comments[0].content).toEqual(payload.content);
    expect(Array.isArray(comments[0].replies)).toEqual(true);
    expect(typeof comments[0].replies[0]).toEqual('object');
    expect(comments[0].replies[0].id).toEqual(payload.replies[0].id);
    expect(comments[0].replies[0].date).toEqual(payload.replies[0].date);
    expect(comments[0].replies[0].content).toEqual(payload.replies[0].content);
    expect(comments[0].replies[0].username).toEqual(payload.replies[0].username);
  });

  it('should create CommentDetail when payload data is correct', () => {
    // Arrange
    const payload = {
      id: 'abc',
      username: 'dicoding',
      date: new Date(),
      content: 'abc',
      isdelete: false,
      replies: [{
        id: '123',
        date: new Date(),
        content: 'new reply',
        username: 'admin',
        isdelete: false,
      }],
    };

    // Action
    const commentDetail = new CommentDetail(payload);
    commentDetail._addComment(payload);
    const comments = commentDetail._getComments();

    // Assert
    expect(Array.isArray(comments)).toEqual(true);
    expect(typeof comments[0]).toEqual('object');
    expect(comments[0].id).toEqual(payload.id);
    expect(comments[0].username).toEqual(payload.username);
    expect(comments[0].date).toEqual(payload.date);
    expect(comments[0].content).toEqual(payload.content);
    expect(Array.isArray(comments[0].replies)).toEqual(true);
    expect(typeof comments[0].replies[0]).toEqual('object');
    expect(comments[0].replies[0].id).toEqual(payload.replies[0].id);
    expect(comments[0].replies[0].date).toEqual(payload.replies[0].date);
    expect(comments[0].replies[0].content).toEqual(payload.replies[0].content);
    expect(comments[0].replies[0].username).toEqual(payload.replies[0].username);
  });
});
