const {ApolloServer,PubSub} = require('apollo-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();


const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000

const server = new ApolloServer({

typeDefs,
resolvers,
context: ({req}) => ({req, pubsub})

});


mongoose.connect(process.env.DB_CONNECTION_URL,{useNewUrlParser:true, useUnifiedTopology: true }).then(()=>{

    server.listen({port:PORT}).then((response)=>{

        console.log(`Server running on port ${response.url}`)
        
        }).catch((error)=>{
        
        console.log(error)
        
        })



}).catch((error)=>{

    console.log(error)

})

