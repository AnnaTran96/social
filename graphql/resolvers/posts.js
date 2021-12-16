const { AuthenticationError, UserInputError } = require('apollo-server');
// const { argsToArgsConfig } = require('graphql/type/definition');

const Post = require('../../models/Post');
const checkAuth = require('../../util/checkAuth');

module.exports = {
    Query: {
        async getPosts(){
            try{
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch(err) {
                throw new Error(err)
            }
        },
        async getPost(_, { postId }) {
            try{
                const post = await Post.findById(postId)
                if(post){
                    return post;
                } else {
                    throw new Error('Post not found')
                } 
            }
            catch(err) {
                    throw new Error(err)
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context){
            const user = checkAuth(context)

            if(body.trim() ===''){
                throw new Error('Post body must not be empty')
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            }) // calls the postSchema body and user keys
            const post = await newPost.save();
            // this is for the post that are subscribed
            // we publish the trigger name "NEW_POST" that was declared in Subscription below
            // the payload will have the value of newPost: post (the value: post is the post that has been created above - on line 40)
            context.pubsub.publish('NEW_POST', {
                newPost: post
            })
            return post;
        },
        async deletePost(_, { postId }, context){
            const user = checkAuth(context);
            try{
                const post = await Post.findById(postId)
                if(user.username === post.username){
                    await post.delete();
                    return 'Post deleted successfully'
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } catch(err){
                throw new Error(err)
            }
        },
        async likePost(_, { postId }, context){
            const { username } = checkAuth(context);
            const post = await Post.findById(postId);
            if(post){
                if(post.likes.find((like) => like.username === username)){
                    // if it finds the comment it will return an object otherwise it will return undefined so its untruthy
                    // Post already liked, so this will unlike it
                    post.likes = post.likes.filter(like => like.username !== username)
                } else {
                    // not liked so like the comment
                    post.likes.push({
                        username
                    })
                }
                await post.save();
                return post;
            } else throw new UserInputError('Post not found')
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST') // it has no parent (_) and arguments (__)
        }
    }
}