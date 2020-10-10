const userRouter = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUser,
  getUserId,
  createUser,
  login,
} = require('../controllers/users');

userRouter.get('/', auth, getUser);
userRouter.get('/:id', auth, getUserId);
userRouter.post('/signup', createUser);
userRouter.post('/signin', login);

module.exports = userRouter;
