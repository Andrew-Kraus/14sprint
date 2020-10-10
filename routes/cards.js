const cardRouter = require('express').Router();
const auth = require('../middlewares/auth');

const { getCard, deleteCard, createCard } = require('../controllers/cards');

cardRouter.get('/', auth, getCard);

cardRouter.delete('/:id', auth, deleteCard);

cardRouter.post('/', auth, createCard);

module.exports = cardRouter;
