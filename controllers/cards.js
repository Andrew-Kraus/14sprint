const Card = require('../models/card');

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (req.user._id !== card.owner) {
        Promise.reject(new Error('У вас нет прав'));
      } else {
        Card.deleteOne({ _id: req.params.cardId })
          // eslint-disable-next-line
          .then((card) => {
            res.send({ data: card });
          });
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Ошибка' });
    });
};
