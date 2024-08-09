const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const createError = require('http-errors'); // Import createError

// Connecting MongoDB
async function mongoDbConnection() {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/db",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      6000
    );
  }
  mongoDbConnection().then( async () => {
    console.log("MongoDB successfully connected.");
    await createAdminUser();
  }).catch(error => {
    console.error('MongoDB connection error:', error);
  });

// Setting up port with express js
const userRoute = require('../backend/routes/user.route')
const messageRoute = require('../backend/routes/message.route')
const logRoute = require("./routes/log.route");
const User = require("../backend/models/User");
const app = express()
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
app.use(cors())
app.use(express.static(path.join(__dirname, 'dist/mean-stack-crud-app')))
app.use('/', express.static(path.join(__dirname, 'dist/mean-stack-crud-app')))
app.use('/api', userRoute)
app.use('/api', messageRoute)
app.use("/api", logRoute);

// Create port
const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message) // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500 // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message) // All HTTP requests must have a response, so let's send back an error with its status code and message
})

const bcrypt = require("bcrypt");

/**
 * Creates an admin user if it doesn't already exist.
 */
const createAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ username: 'alp' });

    if (!adminUser) {
      const newUser = new User({
        username: 'alp',
        password: await bcrypt.hash('alp', 10),
        name: 'alp',
        surname: 'kaplan',
        birthdate: new Date(),
        gender: 'male',
        email: 'alp@srdc.com',
        location: 'Ankara',
        isAdmin: true
      });
      await newUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
