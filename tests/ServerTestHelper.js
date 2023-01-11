/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../src/Infrastructures/security/JwtTokenManager');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTestHelper = {
  async getAccessToken() {
    const payloadUser = {
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };
    await UsersTableTestHelper.addUser(payloadUser);
    const jwt = new JwtTokenManager(Jwt.token);
    return jwt.createAccessToken(payloadUser);
  },
};

module.exports = ServerTestHelper;
