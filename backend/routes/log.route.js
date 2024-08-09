/**
 * Express router providing log-related routes.
 * @module routes/log
 */

const express = require("express");
const logRoute = express.Router();
const Log = require("../models/Log");
const JWTUtil = require("../utils/auth");

/**
 * Route serving all logs.
 * @name get/log
 * @function
 * @memberof module:routes/log~logRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
logRoute.route("/log").get(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!JWTUtil.verifyToken(token)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sortField || 'requestTime';
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
  const skip = (page - 1) * limit;

  let query = {};

  // Add filter conditions
  if (req.query.filterUsername) {
    query.username = { $regex: req.query.filterUsername, $options: 'i' };
  }
  if (req.query.filterIP) {
    query.ip = { $regex: req.query.filterIP, $options: 'i' };
  }
  if (req.query.filterBrowser) {
    query.browser = { $regex: req.query.filterBrowser, $options: 'i' };
  }
  if (req.query.filterEndpoint) {
    query.endpoint = { $regex: req.query.filterEndpoint, $options: 'i' };
  }
  if (req.query.filterMethod) {
    query.method = req.query.filterMethod;
  }
  if (req.query.filterStatusCode) {
    query.statusCode = req.query.filterStatusCode;
  }

  // Add date range filter
  const { startDate, endDate } = req.query;
  if (startDate || endDate) {
    query.requestTime = {};
    if (startDate) {
      query.requestTime.$gte = new Date(startDate);
    }
    if (endDate) {
      query.requestTime.$lte = new Date(endDate);
    }
  }

  try {
    const logs = await Log.find(query)
      .collation({ locale: 'en', strength: 2 }) // Case-insensitive collation
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);
    const totalLogs = await Log.countDocuments(query);

    res.json({
      logs,
      totalLogs,
      currentPage: page,
      totalPages: Math.ceil(totalLogs / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = logRoute;
