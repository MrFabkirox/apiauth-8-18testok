const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/apiauth', {
    useNewUrlParser: true,
    useCreateIndex: true
  })
} else {
  mongoose.connect('mongodb://localhost/apiauth', {
    useNewUrlParser: true,
    useCreateIndex: true
  })
}

const app = express()

// Middlewares
// app.use(morgan('dev'))
app.use(bodyParser.json())

// Routes
app.use('/users', require('./routes/users'))

app.get('/', (req, res) => {
  res.json({
    message: 'index of apiauth-8'
  });
})

// Reaching here, no route has matched the request
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Sending the error, from the 404 or any other source
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app
