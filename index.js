// Dependency imports

const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

// Relative Imports

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers')
const { MONGODB } = require('./config.js');

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }) // we will take the request and forward that body ( this is for getting the authentication code and passing it into the header )
});

// Start databse before server
// Pass in the DB and options
// useNewUrlParser returns a promise so we need to do a .then

// FUTURE
// (node:13638) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.

mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB connected')
        return server.listen({ port: 5000 })
    })
    .then(res => {
        console.log(`Server running at ${res.url}`)
    });
    