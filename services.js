const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI);
const { Schema } = mongoose
const liveSchema = new Schema({
    password: String,
    title: String,
    user: String,
    viewer: Number,
    banner: String,
});

const liveModel = mongoose.model('live', liveSchema)

liveModel.find().exec((err, live) => {
    console.log('live', live);
})