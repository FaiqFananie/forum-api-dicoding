const PayloadLike = require('../PayloadLike');

describe('a PayloadLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: '123',
      commentId: 'abc',
    };

    // Action and Assert
    expect(() => new PayloadLike(payload)).toThrowError('PAYLOAD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      commentId: true,
      owner: 123,
    };

    // Action and Assert
    expect(() => new PayloadLike(payload)).toThrowError('PAYLOAD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create payload object correctly', () => {
    // Arrange
    const payload = {
      threadId: '123',
      commentId: '123',
      owner: '123',
    };

    // Action
    const { threadId, commentId, owner } = new PayloadLike(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
