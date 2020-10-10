const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('notFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'notFound') {
        res.status(404).send({ message: 'Такого пользователя не существует' });
      }
      res.status(500).send({ message: 'Ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  User.init().then(() => {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
      .then((user) => User.findById(user._id))
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные' });
        }
        res.status(500).send({ message: 'Ошибка' });
      });
  });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 900000,
        httpOnly: true,
        sameSite: true,
      });
      res.send(token);
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
