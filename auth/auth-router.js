const router = require("express").Router();
const bcrypt = require("bcryptjs");
const secrets = require("../config/secrets");
const jwt = require("jsonwebtoken");

const Users = require("../users/users-model");

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      const token = generateToken(saved);
      res.status(201).json({
        message: `User ${saved.username} account created. Welcome!`,
        token
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Error saving user",
        err
      });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(201).json({
          message: `Welcome, ${user.username}!`,
          token
        });
      } else {
        res.status(400).json({
          message: "YOU SHALL NOT PASS!"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Error logging in",
        err
      });
    });
});

//Function for use in generating authN token
function generateToken(user) {

  const payload = {
    sub: user.id,
    username: user.username,
    department: user.department
  };

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
