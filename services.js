const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI);
const { Schema, model } = mongoose
const liveSchema = new Schema({
    id: String,
    password: String,
    title: String,
    uid: {
        type: String,
        unique: true,
    },
    user: String,
    viewer: Number,
    banner: String,
    description: {
        type: Object
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    }
});

const liveModel = model('Live', liveSchema)

// liveModel.count({}).then(res => console.log(res))

module.exports = {
    liveModel, liveSchema
}
// const admin = new liveModel({
//     "password": "010110",
//     "title": "测试房",
//     "user": "admin",
//     "viewer": 10,
//     "banner": "https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181226%2Ffab5d53db33e451aa77bd0e2b29eb1fa.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633623474&t=95f0190c1c24be3e3a2e6c1e809d2b61"
// })
// admin.save().then((res) => console.log(res))

// liveModel.find().then((res) => console.log(res))

// const CatSchema = new Schema({
//     name: String
// })

// const CatModel = model('Cat', CatSchema)

// const kitty = new CatModel({name: 'zibenjia'})
// CatModel.find().then((res) => console.log(res))