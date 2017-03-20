const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
} = require('graphql');
const models = require('../models');
const { DirectorType, MovieType } = require('./types');

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

module.exports = {
  Mutation
}