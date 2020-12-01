const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const {UserInputError} = require('apollo-server');

const {validateRegisterInput, validateLoginInput} = require('../../util/validators');
const userModel = require('../../models/userModel');

function generateToken(user) {
   return jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email

    }, process.env.JWT_AUTH_TOKEN, {expiresIn:'1h'})
}

module.exports = {

    Mutation: {

        async login(_,{username, password}){

            const dataValidation = await validateLoginInput({username,password});

            if(dataValidation.error){

                throw new UserInputError('Errors',{errors: dataValidation.error.details[0].message})
                
            }

            const user = await userModel.findOne({username})

            if(!user){

                
                throw new UserInputError('User not found',{errors:'User not found'})
                
            }

                const match = await bcrypt.compare(password, user.password);

                if(!match){

                throw new UserInputError('The password you entered is incorrect. Please try again',{errors:'The password you entered is incorrect. Please try again'})
                }

                const token = generateToken(user);

                
            return {

                ...user._doc,
                id: user._id,
                token

            }


        },


        async register(_, { registerInput: { username, email, password, confirmPassword } }) {

            const user = await userModel.findOne({username})
            if(user){
                throw new UserInputError('Username is taken',{
                    errors:{
                        username: 'This username is taken'

                    }
                })
            }

            const dataValidation = await validateRegisterInput({username, email, password, confirmPassword});
          
            if(dataValidation.error){
               
                throw new UserInputError('Errors',{errors: dataValidation.error.details[0].message})

            }

            password = await bcrypt.hash(password, 12);

            const newUser = new userModel({
                email,
                username,
                password,
                createdAt: new Date().toISOString()

            })

            const res = await newUser.save();

            const token = generateToken(res)

            return {

                ...res._doc,
                id: res._id,
                token

            }

        }

    }

}