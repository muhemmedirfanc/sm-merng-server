const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const {AuthenticationError} = require('apollo-server');


module.exports = (context) =>{

   // console.log(context.req.headers.authorization)

    const autHeader = context.req.headers.authorization;
    
    if(autHeader){

        const token = autHeader.split('Bearer ')[1];
        if(token){
            
            try {
                const user = jwt.verify(token,process.env.JWT_AUTH_TOKEN);
                return user
            } catch (error) {
                throw new AuthenticationError('Invalid/Expired token')
            }

        }throw new Error('Authentication token must be \'Bearer [token]')
    }throw new Error('Authentication header must be provided')

}