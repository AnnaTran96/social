const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

// if it is not a default export from the file, we must destructure it so we do {variableName}

const { valdidateRegisterInput, validateLoginInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h'})
}

module.exports = {
    Mutation: {
        // login and register is defined in typeDef type Mutation
        async login(_, { username, password }){
            
            const { errors, valid } = validateLoginInput(username, password);

            if(!valid) {
                throw new UserInputError('Errors', { errors })
            }

            const user = await User.findOne({ username })
            
            if(!user){
                errors.general = 'User not found'
                throw new UserInputError('User not found', { errors })
            }
            
            const match = await bcrypt.compare(password, user.password)
            if(!match){
                errors.general = 'Wrong credentials'
                throw new UserInputError('Wrong credentials', { errors })
            }
            
            const token = generateToken(user)
            
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(_, { registerInput: { username, email, password, confirmedPassword }}){
            
            const { valid, errors } = valdidateRegisterInput(username, email, password, confirmedPassword)
            
            if(!valid){
                throw new UserInputError('Errors', { errors })
            }
            
            const user = await User.findOne({ username })
            if(user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken' // this will be displayed on the frontend
                    }
                })
            }
            
            password = await bcrypt.hash(password, 12) // 12 is the number of rounds it asks us
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })
            
            const res = await newUser.save();
            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }

        }
    }
}

// register(parent, args, context, info)
// parent: gives the last input of the last step
// but we will replace parent with _ now so it doesn't take up space in the DB as we don't really need it 
// args: it's the arguments from registerInput we created in the typeDefs
// context: 
// info: info about the metadata