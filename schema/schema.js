'use strict';
const urlController = require('../controllers/urlController');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLBoolean,
} = require('graphql');

const urlType = new GraphQLObjectType({
  name: 'url',
  description: 'Shortened URL record',
  fields: () => ({
    _id: { type: GraphQLID },
    hash: { type: GraphQLString },
    url: { type: GraphQLString },
    short_url: { type: GraphQLString },
    isObscured: { type: GraphQLBoolean },
    expiresAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  }),
});

const Mutation = new GraphQLObjectType({
  name: 'MutationType',
  description: 'Mutations...',
  fields: {
    shortenUrl: {
      type: urlType,
      description: 'Shorten a URL',
      args: {
        url: { type: new GraphQLNonNull(GraphQLString) },
        isObscured: { type: GraphQLBoolean },
        expiresAt: { type: GraphQLInt },
      },
      resolve(parent, args, { req, res, next, io }) {
        return urlController.minify(req, { ...args }, io);
      },
    },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    listURLs: {
      type: new GraphQLList(urlType),
      description: 'Get all URLs',
      resolve(parent, args, { req }) {
        return urlController.list(req);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
