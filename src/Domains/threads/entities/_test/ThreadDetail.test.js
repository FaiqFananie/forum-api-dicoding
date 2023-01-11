const ThreadDetail = require('../ThreadDetail');

describe('an ThreadDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'abc',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: new Date(),
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload have wrong data type property', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: new Date(),
      username: 'admin',
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ThreadDetail when payload is correct', () => {
    // Arrange
    const payload = {
      id: 'abc',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: new Date(),
      username: 'admin',
    };

    // Action
    const {
      id, title, body, date, username,
    } = new ThreadDetail(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });

  it('should throw error when addComment with wrong data types', () => {
    // Arrange
    const payload = {
      id: 'abc',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: new Date(),
      username: 'admin',
    };

    const threadDetail = new ThreadDetail(payload);

    // Action and Assert
    expect(() => threadDetail._addComments({})).toThrowError('THREAD_DETAIL.COMMENTS_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => threadDetail._addComments([1])).toThrowError('THREAD_DETAIL.COMMENTS_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => threadDetail._addComments([{
      id: '123',
      username: 'admin',
      date: new Date(),
      content: 'new comment',
      replies: {},
    }])).toThrowError('THREAD_DETAIL.COMMENTS_ELEMENT_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => threadDetail._addComments([{
      id: '123',
      username: 'admin',
      date: new Date(),
      content: 'new comment',
      replies: [1],
    }])).toThrowError('THREAD_DETAIL.COMMENTS_REPLIES_NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => threadDetail._addComments([{
      id: '123',
      username: 'admin',
      date: new Date(),
      content: 'new comment',
      replies: [{
        id: true,
        content: 'new reply',
        date: new Date(),
        username: 'admin',
      }],
    }])).toThrowError('THREAD_DETAIL.COMMENTS_REPLIES_ELEMENT_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when addComment with uncomplete data', () => {
    // Arrange
    const payload = {
      id: 'abc',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: new Date(),
      username: 'admin',
    };

    const threadDetail = new ThreadDetail(payload);

    // Action and Assert
    expect(() => threadDetail._addComments([{
      id: '123',
      username: 'admin',
      date: new Date(),
      content: 'new comment',
    }])).toThrowError('THREAD_DETAIL.COMMENTS_ELEMENT_NOT_CONTAIN_NEEDED_PROPERTY');
    expect(() => threadDetail._addComments([{
      id: '123',
      username: 'admin',
      date: new Date(),
      content: 'new comment',
      replies: [{
        id: '123',
        content: 'new reply',
        date: new Date(),
      }],
    }])).toThrowError('THREAD_DETAIL.COMMENTS_REPLIES_ELEMENT_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should add comments when addComment with correct data', () => {
    // Arrange
    const payload = {
      id: 'abc',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: new Date(),
      username: 'admin',
    };

    const payloadComments = [{
      id: '123',
      username: 'admin',
      date: new Date(),
      content: 'new comment',
      replies: [{
        id: '123',
        content: 'new reply',
        date: new Date(),
        username: 'admin',
      }],
    }];

    const threadDetail = new ThreadDetail(payload);

    // Action
    threadDetail._addComments(payloadComments);

    // Assert
    const { comments } = threadDetail;
    expect(Array.isArray(comments)).toEqual(true);
    expect(typeof comments[0]).toEqual('object');
    expect(comments[0].id).toEqual(payloadComments[0].id);
    expect(comments[0].username).toEqual(payloadComments[0].username);
    expect(comments[0].date).toEqual(payloadComments[0].date);
    expect(comments[0].content).toEqual(payloadComments[0].content);
    expect(Array.isArray(comments[0].replies)).toEqual(true);
    expect(typeof comments[0].replies[0]).toEqual('object');
    expect(comments[0].replies[0].id).toEqual(payloadComments[0].replies[0].id);
    expect(comments[0].replies[0].content).toEqual(payloadComments[0].replies[0].content);
    expect(comments[0].replies[0].date).toEqual(payloadComments[0].replies[0].date);
    expect(comments[0].replies[0].username).toEqual(payloadComments[0].replies[0].username);
  });

  it('should add comments when addComment with no replies', () => {
    // Arrange
    const payload = {
      id: 'abc',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: new Date(),
      username: 'admin',
    };

    const payloadComments = [{
      id: '123',
      username: 'admin',
      date: new Date(),
      content: 'new comment',
      replies: [],
    }];

    const threadDetail = new ThreadDetail(payload);

    // Action
    threadDetail._addComments(payloadComments);

    // Assert
    const { comments } = threadDetail;
    expect(Array.isArray(comments)).toEqual(true);
    expect(typeof comments[0]).toEqual('object');
    expect(comments[0].id).toEqual(payloadComments[0].id);
    expect(comments[0].username).toEqual(payloadComments[0].username);
    expect(comments[0].date).toEqual(payloadComments[0].date);
    expect(comments[0].content).toEqual(payloadComments[0].content);
    expect(Array.isArray(comments[0].replies)).toEqual(true);
  });
});
