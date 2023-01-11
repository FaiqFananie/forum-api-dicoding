const PayloadComment = require('../PayloadComment');

describe('a PayloadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: '123',
      content: 'abc',
    };

    // Action and Assert
    expect(() => new PayloadComment(payload)).toThrowError('PAYLOAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      content: true,
      owner: 123,
    };

    // Action and Assert
    expect(() => new PayloadComment(payload)).toThrowError('PAYLOAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create payload object correctly', () => {
    // Arrange
    const payload = {
      threadId: '123',
      content: 'Dicoding Indonesia',
      owner: '123',
    };

    // Action
    const { threadId, content, owner } = new PayloadComment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
