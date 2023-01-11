const AddedThread = require('../AddedThread');

describe('an AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'abc',
      title: 'abc',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('THREAD_ADDED.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: true,
      owner: '1234',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('THREAD_ADDED.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedThread object correctly', () => {
    // Arrange
    const payload = {
      id: '123',
      title: 'Dicoding Indonesia',
      owner: '1234',
    };

    // Action
    const {
      id, title, body, owner,
    } = new AddedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
