const PayloadReply = require('../PayloadReply');

describe('a PayloadReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: '123',
      commentId: '123',
      content: 'abc',
    };

    // Action and Assert
    expect(() => new PayloadReply(payload)).toThrowError('PAYLOAD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123,
      commentId: 123,
      content: true,
      owner: 123,
    };

    // Action and Assert
    expect(() => new PayloadReply(payload)).toThrowError('PAYLOAD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create payload object correctly', () => {
    // Arrange
    const payload = {
      threadId: '123',
      commentId: '123',
      content: 'Dicoding Indonesia',
      owner: '123',
    };

    // Action
    const {
      threadId, commentId, content, owner,
    } = new PayloadReply(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
