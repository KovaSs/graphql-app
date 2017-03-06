const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
} = require('graphql');
const models = require('../models');

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    director: { 
      type: DirectorType,
      resolve(parent) {
        return models.Directors.findById(parent.directorId);
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
        return models.Movies.find({ directorId: parent.id })
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDirector: {
      type: DirectorType,
      args: { 
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(_, args) {
        const director = new models.Directors({
          name: args.name,
          age: args.age,
        });
        return director.save();
      },
    },
    addMovie: {
      type: MovieType,
      args: { 
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        directorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(_, args) {
        const movie = new models.Movies({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId,
        });
        return movie.save();
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: { 
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(_, args) {
        return models.Directors.findByIdAndRemove(args.id);
      },
    },
    deleteMovie: {
      type: MovieType,
      args: { 
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(_, args) {
        return models.Movies.findByIdAndRemove(args.id);
      },
    },
    updateDirector: {
      type: DirectorType,
      args: { 
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(_, args) {
        return models.Directors.findByIdAndUpdate(args.id, 
          { $set: { name: args.name, age: args.age } },
          { new: true }
        );
      },
    },
    updateMovie: {
      type: MovieType,
      args: { 
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        directorId: { type: GraphQLID },
      },
      resolve(_, args) {
        const { id: movieId, ...movieProps } = args;
        return models.Movies.findByIdAndUpdate(movieId, 
          { $set: { ...movieProps } },
          { new: true }
        );
      },
    },
  }
});

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

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});