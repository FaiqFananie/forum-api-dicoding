const PayloadThread = require('../PayloadThread');

describe('a PayloadThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
      body: 'abc',
    };

    // Action and Assert
    expect(() => new PayloadThread(payload)).toThrowError('PAYLOAD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      owner: 123,
    };

    // Action and Assert
    expect(() => new PayloadThread(payload)).toThrowError('PAYLOAD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create payload object correctly', () => {
    // Arrange
    const payload = {
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      owner: '123',
    };

    // Action
    const { title, body, owner } = new PayloadThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
