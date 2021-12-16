const { model, Schema } = require('mongoose');

// we can define whether or not it is required in the graphql layer rather than mongoose

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String
})

// we are exporting the model (pass the name and the schema it uses)

module.exports = model('User', userSchema);