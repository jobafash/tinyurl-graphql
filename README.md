# tinyurl-graphql

A minimalist GraphQL API(Node.js) to shorten URLs

## Setup

Run `npm install` to install dependencies.

### API

Create a `.env` file, and look at the `.env.example` for guidance.

`DB_URL` should be a connection string to a MongoDB instance.  
`PORT` can be set to any open port number.

## GraphQL API Documentation

**NOTE:** The `hash` of a shortened link is the part after the last `/`. So for `https://example.com/ABCD` the `hash` would be `ABCD`.

### Mutations

#### `/shortenUrl`

Shorten a URL with options.

```js
// The URL to shorten
url: { type: new GraphQLNonNull(GraphQLString) },

// OPTIONAL
// Set to "true" if the shortened URL should be return a longer hash
isObscured: { type: GraphQLBoolean },

expiresAt: { type: GraphQLInt }
```

### Queries

#### `/listURLs`

List all URLs shortened.

P.S. Pasting the shortened link in a browser redirects the user to the original URL. Easy-peasy
