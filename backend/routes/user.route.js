/**
 * Express router providing user-related routes.
 * @module routes/user
 */

const express = require("express");
const userRoute = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Message = require("../models/Message");
const JWTUtil = require("../utils/auth");
const loggingMiddleware = require("../middleware/logging");

// Use the logging middleware
userRoute.use(loggingMiddleware);

// User Model

/**
 * Route for user login.
 * @name post/user/login
 * @function
 * @memberof module:routes/user~userRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
userRoute.route("/user/login").post(async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const payload = { id: user._id, username: user.username, isAdmin: user.isAdmin };
    const token = JWTUtil.generateToken(payload);

    // Add token to valid tokens list
    JWTUtil.addToken(token);

    res.json({ token:token });
  } catch (err) {
    next(err);
  }
});

/**
 * Route for user logout.
 * @name get/user/logout
 * @function
 * @memberof module:routes/user~userRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
userRoute.route("/user/logout").get((req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  // Remove token from valid tokens list
  JWTUtil.deleteToken(token);
  res.json({ message: "Logged out successfully" });
});

/**
 * Route for creating a new user.
 * @name post/user/create
 * @function
 * @memberof module:routes/user~userRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
userRoute.route("/user/create").post(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!JWTUtil.verifyToken(token)) return res.status(401).json({ message: "Unauthorized" });
  else if(!JWTUtil.isAdmin(token)) return res.status(403).json({ message: "Forbidden" });

  const { password, ...otherData } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { ...otherData, password: hashedPassword };

    const newUser = new User(userData);
    await newUser.save();

    res.json({
      message: "Data successfully added!",
      status: 200,
    });
  } catch (err) {
    res.status(400).json({ message: "A user with the given username already exists!" });
  }
});

/**
 * Route for getting all users with optional filters, sorting, and pagination.
 * @name get/user
 * @function
 * @memberof module:routes/user~userRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
userRoute.route("/user").get(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!JWTUtil.verifyToken(token)) return res.status(401).json({ message: "Unauthorized" });
  else if(!JWTUtil.isAdmin(token)) return res.status(403).json({ message: "Forbidden" });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sortField || 'username';
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
  const skip = (page - 1) * limit;

  let query = {};

  // Add filter conditions
  if (req.query.filterUsername) {
    query.username = { $regex: req.query.filterUsername, $options: 'i' };
  }
  if (req.query.filterName) {
    query.name = { $regex: req.query.filterName, $options: 'i' };
  }
  if (req.query.filterSurname) {
    query.surname = { $regex: req.query.filterSurname, $options: 'i' };
  }
  if (req.query.filterGender) {
    query.gender = req.query.filterGender;
  }
  if (req.query.filterEmail) {
    query.email = { $regex: req.query.filterEmail, $options: 'i' };
  }
  if (req.query.filterLocation) {
    query.location = { $regex: req.query.filterLocation, $options: 'i' };
  }
  if (req.query.isAdmin && req.query.isAdmin !== 'all') {
    query.isAdmin = req.query.isAdmin === 'true';
  }

  // Add date range filter
  const { startDate, endDate } = req.query;
  if (startDate || endDate) {
    query.birthdate = {};
    if (startDate) {
      query.birthdate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.birthdate.$lte = new Date(endDate);
    }
  }

  try {
    const users = await User.find(query)
      .select('-password') // Exclude the password field
      .collation({ locale: 'en', strength: 2 }) // Case-insensitive collation
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);
    const totalUsers = await User.countDocuments(query);

    res.json({
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Route for getting a single user by ID.
 * @name get/user/read/:id
 * @function
 * @memberof module:routes/user~userRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
userRoute.route("/user/read/:id").get(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!JWTUtil.verifyToken(token)) return res.status(401).json({ message: "Unauthorized" });
  else if(!JWTUtil.isAdmin(token)) return res.status(403).json({ message: "Forbidden" });

  await User.findById(req.params.id, req.body).select('-password')
    .then((result) => {
      res.json({
        data: result,
        message: "Data successfully retrieved.",
        status: 200,
      });
    })
    .catch((err) => {
      return next(err);
    });
});

/**
 * Route for updating a user by ID.
 * @name put/user/update/:id
 * @function
 * @memberof module:routes/user~userRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
userRoute.route("/user/update/:id").put(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!JWTUtil.verifyToken(token)) return res.status(401).json({ message: "Unauthorized" });
  else if(!JWTUtil.isAdmin(token)) return res.status(403).json({ message: "Forbidden" });

  try {
    await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });

    res.json({
      msg: "Data successfully updated.",
    });
  } catch (err) {
    return res.status(400).json({ message: "A user with given username already exists!" });
  }
});

/**
 * Route for deleting a user by ID.
 * @name delete/user/delete/:id
 * @function
 * @memberof module:routes/user~userRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
userRoute.route("/user/delete/:id").delete(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!JWTUtil.verifyToken(token)) return res.status(401).json({ message: "Unauthorized" });
  else if(!JWTUtil.isAdmin(token)) return res.status(403).json({ message: "Forbidden" });

  const userId = req.params.id;
  try {
    const user = await User.findByIdAndRemove(userId);
    if (user) {
      JWTUtil.deleteTokensById(userId);

      // Update messages where the deleted user is the sender or receiver
      await Message.updateMany(
        { sender: user.username },
        { $set: { sender: "~ deleted user ~" } }
      );
      await Message.updateMany(
        { receiver: user.username },
        { $set: { receiver: "~ deleted user ~" } }
      );

      res.json({ msg: "Data successfully deleted." });
    } else {
      res.status(404).json({ msg: "User not found." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error." });
  }
});

/**
 * Route for searching users by username.
 * @name get/user/search
 * @function
 * @memberof module:routes/user~userRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
userRoute.route('/user/search').get(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!JWTUtil.verifyToken(token)) return res.status(401).json({ message: "Unauthorized" });

  const searchTerm = req.query.username;
  try {
    const users = await User.find({ username: { $regex: searchTerm, $options: 'i' } }).select('username');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = userRoute;
