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
  Card.findById(req.params.id)
    .orFail(new Error('notFound'))
  // eslint-disable-next-line
    .then((card) => {
      // eslint-disable-next-line
      if(req.user._id != card.owner){
        return Promise.reject(new Error('notEnoughRights'));
      // eslint-disable-next-line
      } else {
        Card.deleteOne({ _id: req.params.id })
        // eslint-disable-next-line
          .then((card) => {
            res.send({ data: card });
          })
          .catch((err) => {
            res.status(500).send({ message: `${err}` });
          });
      }
    })
    .catch((err) => {
      if (err.message === 'notEnoughRights') {
        // eslint-disable-next-line
        res.status(403).send({ message: 'У вас недостаточно прав' });
        return;
        // eslint-disable-next-line
      }
      // eslint-disable-next-line
      else if (err.message === 'notFound') {
        // eslint-disable-next-line
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      // eslint-disable-next-line
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};
