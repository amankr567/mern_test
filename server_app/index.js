const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const cors = require('cors');
const app = express();
const port = 8000;

app.get('/', (req, res) => res.send('Welcome to Test API'));

// parse various different custom JSON types as JSON
app.use(express.json());

app.use(cors()); // using for cross origin issue

// ==================== Custome Class for different tasks ==============

const obj = {
  // Function for send Api response in proper formate
  setformate: function (status, message, data) {
    return {
      status: status,
      message: message,
      data: data,
    };
  },
  inc: function (param) {
    let mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
    let mystr = mykey.update(param, 'utf8', 'hex');
    mystr += mykey.final('hex');

    return mystr;
  },
  decr: function (param) {
    let mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
    let mystr = mykey.update(param, 'hex', 'utf8');
    mystr += mykey.final('utf8');

    return mystr;
  },
};

// POST /login get json body params
app.post(
  '/login',
  [
    // username must be available
    body('username'),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }),
  ],
  function (req, res) {
    //  console.log(req.body);

    // Finds the validation errors in this request and wraps them in an object with handy functions
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Storing request param into variable
    let username = req.body.username;
    let password = req.body.password;

    // Checking login rules (Note: Static only for two users check)
    if (
      (username.toLowerCase() === 'aman' ||
        username.toLowerCase() === 'raman') &&
      password === 12345
    ) {
      let randomnum = Math.random(); // Generating random number for return as token
      let token = obj.inc(`${randomnum}_${username.toLowerCase()}`); // Generating token

      res.status(200).json(
        obj.setformate(200, 'Login Successfull...!!', {
          username: username,
          password: password,
          token: token,
        })
      ); // Sending success response
    } else {
      res.status(401).json(
        obj.setformate(401, 'Login Failled...!!', {
          username: username,
          password: password,
        })
      ); // Sending failled response
    }
  }
);

// POST /authenticate get json body params
app.post(
  '/authenticate',
  [
    // token must be available
    body('token'),
  ],
  function (req, res) {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Storing request param into variable
    let token = obj.decr(req.body.token);
    let username = token.split('_'); // split strig to parse username from token

    res
      .status(200)
      .json(
        obj.setformate(200, 'Token Validated ... !!', { username: username[1] })
      ); // Sending success response
  }
);

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
