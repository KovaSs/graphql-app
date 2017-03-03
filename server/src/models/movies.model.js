const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MoviesSchema = new Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  directorId: { type: String, required: true },
})

module.exports = mongoose.model('movies', MoviesSchema);