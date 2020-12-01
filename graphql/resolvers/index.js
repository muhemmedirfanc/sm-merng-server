const postsResolvers = require("./postsResolvers");
const userResolvers = require('./usersResolvers');
const commentsResolvers  = require('./commentsResolvers')


module.exports = {
        Post:{

            likeCount: (parent)=> parent.likes.length,
            commentCount: (parent)=> parent.comments.length

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