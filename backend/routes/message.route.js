/**
 * Express router providing message-related routes.
 * @module routes/message
 */

const express = require("express");
const messageRoute = express.Router();
const Message = require("../models/Message");
const User = require("../models/User");
const JWTUtil = require("../utils/auth");
const loggingMiddleware = require("../middleware/logging");

// Use the logging middleware
messageRoute.use(loggingMiddleware);

// Message Model

/**
 * Route serving messages (inbox or outbox) with sorting and filtering.
 * @name get/message
 * @function
 * @memberof module:routes/message~messageRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
messageRoute.route('/message').get(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!JWTUtil.verifyToken(token)) return res.status(401).json({ message: "Unauthorized" });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortField = req.query.sortField || 'timestamp';
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
  const username = JWTUtil.getUsername(token);
  const inout = req.query.inout;

  let query = {};
  if (inout === 'in') {
    query = { receiver: username, receiverDeleted: false };
  } else if (inout === 'out') {
    query = { sender: username, senderDeleted: false };
  } else {
    return res.status(400).json({ message: "Invalid inout parameter" });
  }

  // Add filter conditions
  if (req.query.filterSender) {
    query.sender = { $regex: req.query.filterSender, $options: 'i' };
  }

  if (req.query.filterReceiver) {
    query.receiver = { $regex: req.query.filterReceiver, $options: 'i' };
  }

  if (req.query.filterContent) {
    query.content = { $regex: req.query.filterContent, $options: 'i' };
  }

  // Add date range filter
  const { startDate, endDate } = req.query;
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) {
      query.timestamp.$gte = new Date(startDate);
    }
    if (endDate) {
      query.timestamp.$lte = new Date(endDate);
    }
  }

  try {
    const messages = await Message.find(query)
      .collation({ locale: 'en', strength: 2 })
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);
    const totalMessages = await Message.countDocuments(query);

    res.json({
      messages,
      totalMessages,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Route for sending a message.
 * @name post/message/send
 * @function
 * @memberof module:routes/message~messageRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
messageRoute.route("/message/send").post(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!JWTUtil.verifyToken(token)) return res.status(401).json({ message: "Unauthorized" });

  const { sender, receiver, content } = req.body;

  try {
    // Check if the receiver exists in the database
    const receiverUser = await User.findOne({ username: receiver });
    if (!receiverUser) {
      return res.status(400).json({ message: "Receiver does not exist" });
    }

    const newMessage = new Message({
      sender,
      receiver,
      content
    });

    const message = await newMessage.save();
    res.json(message);
  } catch (err) {
    next(err);
  }
});

/**
 * Route for deleting a message for a user.
 * @name delete/message/delete/:id
 * @function
 * @memberof module:routes/message~messageRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
messageRoute.route("/message/delete/:id").delete(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!JWTUtil.verifyToken(token)) return res.status(401).json({ message: "Unauthorized" });

  const messageId = req.params.id;
  const username = JWTUtil.getUsername(token);

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    let removed = false;
    if (message.sender === username) {
      message.senderDeleted = true;
      removed = true;
    }
    if (message.receiver === username) {
      message.receiverDeleted = true;
      removed = true;
    }
    if (!removed) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await message.save();
    res.json({ message: "Message deleted for user" });
  } catch (err) {
    next(err);
  }
});

module.exports = messageRoute;
