const postsResolvers = require('./posts');
const userResolvers = require('./users');
const commentsResolvers = require('./comments');

// this will return an object of the combined resolvers

module.exports = {
    // add name of the types from the typeDef
    // anything that goes is queried, mutated and is in the subscription will go through Post and become modified. Post acts as a modifier
    Post: {
        likeCount: (parent) => parent.likes.length,
            // it needs the parent as the parent holds the data that comes from the previous step 
            // console.log(parent);
        commentCount: (parent) => parent.comments.length
    },
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription
    }
}