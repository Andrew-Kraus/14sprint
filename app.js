const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();
const getUser = require('./routes/users');
const getCard = require('./routes/cards');
const login = require('./routes/users');
const createUser = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/users', getUser);
app.use('/cards', getCard);
app.post('/signin', login);
app.post('/signup', createUser);

app.use('/', (req, res) => {
  res.set({ 'Content-type': 'Application/json, Charset=utf-8' });
  res.status(404).end(JSON.stringify({ message: 'Запрашиваемый ресурс не найден' }), 'utf8');
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
// 1 проверка //
