const {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');
const models = require('../models');
const { DirectorType, MovieType } = require('./types');

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return models.Movies.findById(args.id);
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(_, args) {
        return models.Directors.findById(args.id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve() {
        return models.Movies.find({});
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve() {
        return models.Directors.find({});
      },
    },
  }
});

module.exports = {
  Query
};