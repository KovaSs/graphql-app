const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema
} = require('graphql');

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    director: { 
      type: DirectorType,
      resolve(parent) {
        return directors.find(director => director.id == parent.directorId)
      },
    },
  }),
});

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent) {
        return movies.filter(movie => movie.directorId == parent.id)
      },
    },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return movies.find(movie => movie.id == args.id)
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return directors.find(director => director.id == args.id)
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve() {
        return movies
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve() {
        return directors
      },
    },
  }
});

module.exports = new GraphQLSchema({
  query: Query,
});