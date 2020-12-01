const joi = require('joi');

const validateRegisterInput = (registerInput)=>{

const schema = joi.object({

    username: joi.string().required(),
    email: joi.string().required().email(),
    password: joi.string().min(6).required(),
    confirmPassword: joi.any().valid(joi.ref('password')).required()
})

return schema.validate(registerInput);

}


const validateLoginInput = (loginInput)=>{

    const schema = joi.object({

        username: joi.string().required(),
        password: joi.string().required()



    })

    return schema.validate(loginInput)
}

module.exports.validateRegisterInput = validateRegisterInput;
module.exports.validateLoginInput = validateLoginInput;