
const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const config = require('./config')
const schema = require('./schema');

const app = express();
const PORT = 3005;

/** Connecting for Mongo Database */
mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
.then(() => console.log('💾 Mongo DB. Connected...'))
.catch((err) => console.log('❌Mongo DB. Error', err))

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(PORT, err => {
  err ? console.log(err) : console.log('Server started!');
});