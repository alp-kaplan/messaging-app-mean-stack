const Log = require('../models/Log');
const JWTUtil = require("../utils/auth");

/**
 * Middleware for logging requests.
 * Logs details about each request such as username, request time, IP address, browser, endpoint, and method.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const loggingMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  let username = "unknown";

  if (token) {
    try {
      username = JWTUtil.getUsername(token);
    } catch (err) {
      // Token verification failed
    }
  }

  const newLog = new Log({
    username: username,
    requestTime: new Date(),
    ip: req.ip,
    browser: req.headers['user-agent'],
    endpoint: req.originalUrl,
    method: req.method,
  });

  res.on('finish', async () => {
    newLog.statusCode = res.statusCode;
    newLog.message = res.statusCode < 400 ? 'success' : res.statusMessage;
    try {
      await newLog.save();
    } catch (err) {
      console.error('Failed to save log:', err);
    }
  });

  next();
};

module.exports = loggingMiddleware;
