const { model, Schema, Types } = require('mongoose');

const NAME_PATTERN = /^[a-zA-z]+ [a-zA-z]+$/i;
//TODO
const userSchema = new Schema({
    name: { type: String, validate: {
        validator: (value) => (NAME_PATTERN.test(value)),
        message: 'Invalid name' 
    }},
    username: { type: String, unique: true, minLength: [5, 'Username must be at least 5 characters long']},
    hashedPassword: { type: String, required: true }
});

userSchema.index({ username : 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);

module.exports = User;