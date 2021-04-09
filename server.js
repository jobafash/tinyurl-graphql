'use strict';
require('dotenv').config();

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const MyGraphQLSchema = require('./schema/schema');


const db = require('./utils/db');
const url = require('./routes/urlRouter');
const port = process.env.PORT || 3000;

const app = express();
const http = require('http').createServer(app);

/**
 * Socket.io to allow real time updates
 */
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * All the application routes
 */
app.use('/', url(io));

/**
 * GraphQL route, logic in schema/schema.js
 */
app.use('/graphiql', (req, res, next) => {
  graphqlHTTP({
    schema: MyGraphQLSchema,
    graphiql: true,
    context: { req, res, next, io },
  })(req, res, next);
});

db.on('connected', () => {
  http.listen(port, () =>
    console.log(`TinyURL listening on port ${port}!`)
  );
});

exports.app = app;