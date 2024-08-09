const jwt = require('jsonwebtoken');
const jwtSecret = 'ATK';
let validTokens = new Set();

class JWTUtil {

  /**
   * Generates a JWT token.
   * @param {object} payload - The payload to include in the token.
   * @param {string} [expiresIn='1h'] - The token expiration time.
   * @returns {string} - The generated token.
   */
  static generateToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, jwtSecret, {expiresIn});
  }

  /**
   * Verifies a JWT token.
   * @param {string} token - The token to verify.
   * @returns {boolean} - True if the token is valid, false otherwise.
   */
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      return decoded && validTokens.has(token);
    } catch (err) {
      return false;
    }
  }

  /**
   * Checks if the token belongs to an admin user.
   * @param {string} token - The token to check.
   * @returns {boolean} - True if the user is an admin, false otherwise.
   */
  static isAdmin(token) {
    try {
      const decoded = jwt.decode(token);
      return decoded && decoded.isAdmin;
    } catch (err) {
      return false;
    }
  }

  /**
   * Adds a token to the set of valid tokens.
   * @param {string} token - The token to add.
   */
  static addToken(token) {
    validTokens.add(token);
  }

  /**
   * Deletes a token from the set of valid tokens.
   * @param {string} token - The token to delete.
   */
  static deleteToken(token) {
    validTokens.delete(token);
  }

  /**
   * Deletes all tokens associated with a specific user ID.
   * @param {string} userId - The user ID whose tokens should be deleted.
   */
  static deleteTokensById(userId) {
    for (let token of validTokens) {
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.id === userId) {
          validTokens.delete(token);
        }
      } catch (err) {
        console.error(`Error decoding token: ${err}`);
      }
    }
  }

  /**
   * Retrieves the username from a token.
   * @param {string} token - The token to decode.
   * @returns {string} - The username from the token.
   */
  static getUsername(token) {
    const decoded = jwt.decode(token);
    return decoded.username;
  }
}

module.exports = JWTUtil;
