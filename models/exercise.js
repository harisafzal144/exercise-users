const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
//const Exercise = require('./exercise');

const ExerciseSchema = new mongoose.Schema({
    description: { type: String, required: true, maxlength: [50, 'Description not too long----> Max 50'] },
    duration: { type: Number, required: true, min: [1, 'Description not too short----> Minimum 1 to 2 min'] },
    date: { type: Date, default: Date.now },
    //userID: { type: String, required: true }
    userID: { type: String, required: true }

})

module.exports = mongoose.model('Exercise', ExerciseSchema);
