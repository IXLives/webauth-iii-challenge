const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const secret = require('../config/secrets')

const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
  const token = req.headers.authorization

  //see if there is a token
  //check if token is valid 
  //    => rehash header + payload + secret and check if match
  // ^ handled by library
  // extract something like user id or username or role or something important

  if (token) {
    jwt.verify(token, secret.jwtSecret, (err, decodedToken) => {
      if (err) {
        console.log('failed verify: ', err)
        res.status(401).json({
          message: 'YOU SHALL NOT PASS!'
        })
      } else {
        //token is valid and not expired
        req.decodedToken = decodedToken
        console.log('verified: ', decodedToken)
        next()
      }
    })
  } else {
    res.status(400).json({
      message: 'YOU SHALL NOT PASS!'
    })
  }
};
