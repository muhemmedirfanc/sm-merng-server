const {AuthenticationError,UserInputError} = require('apollo-server');

const postModel =  require('../../models/postModel');
const tokenAuth = require('../../util/tokenAuth');

module.exports = {
    
    Query: {

        async getPosts(){
 
         try {
             const posts =  await postModel.find().sort({createdAt: -1});
             return posts
         } catch (error) {
             
         }
         throw new Error(err);
        },
      async getPost(_,{postId}){

        try {
            
            const post = await postModel.findById(postId);
            if(post){
                return post;
            }else{
                throw new Error('Post not found');
            }

        } catch (error) {

            throw new Error(error)
            
        }

      }
 
     },
     
      Mutation: {

        async createPost(_,{body}, context){
            const user = tokenAuth(context);

            if(body.trim()=== ''){
                throw new Error('Post must not be empty')
            }

            const newPost = new postModel({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const post = await newPost.save();

            context.pubsub.publish('NEW_POST',{newPost: post})
            return post;

        },

        async deletePost(_, {postId}, context){
            const user = tokenAuth(context);
    
            try {
                const post = await postModel.findById(postId);
               
                if(user.username === post.username){
                    await post.delete();
                    return 'Post deleted successfully'
                }else{
                    throw new AuthenticationError('You are not authorized to delete this post');
                }
    
            } catch (error) {
                throw new Error(error);
            }
    
          },

          async likePost(_,{postId},context){

            const user = tokenAuth(context);
            const post = await postModel.findById(postId);
            if(post){

                if(post.likes.find(like => like.username === user.username)){

                    post.likes = post.likes.filter(like => like.username !== user.username);
                   

                }else{
                        post.likes.push({

                            username: user.username,
                            createdAt: new Date().toISOString()
                        })
                 
                }

                await post.save();
                return post;

            }else{

            throw new UserInputError('post not found')
            }

          }

      },
      Subscription: {
          newPost :{
              subscribe: (_,__,{pubsub}) => pubsub.asyncIterator('NEW_POST')
          }
      }
     

}