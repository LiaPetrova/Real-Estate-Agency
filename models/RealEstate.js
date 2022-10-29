const { model, Types, Schema } = require('mongoose');

const URL_PATTERN = /https?:\/\/+/i;

const realEstateSchema = new Schema({
    name: { type: String, minLength: [6, 'Name must be at least 6 characters long']},
    type: { type: String, enum:{ values: ['Apartment', 'Villa', 'House'], message: 'Allowed types of real estates are: Apartment, Villa and House'}},
    year: { type: Number, min: [1850, 'The year must be between 1850 and 2021'], max: [2021, 'The year must be between 1850 and 2021']},
    city: { type: String, minLength: [4, 'City must be at least 4 characters long']},
    imageUrl: { type: String, validate: {
        validator: (value) => (URL_PATTERN.test(value)),
        message: 'Invalid URL' 
    }},
    description: { type: String, maxLength: [60, 'Descriptiom cannot be longer than 60 characters']},
    availablePieces: { type: Number, min: [0, 'Available pieces must be a positive number'], max: [10, 'Available pieces cannot be bigger than 10']},
    renters: { type: [Types.ObjectId], ref: 'User', default: []},
    owner: { type: Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: String, required: true, default: () => Date.now () },
});

const RealEstate = model('RealEstate', realEstateSchema);

module.exports = RealEstate;