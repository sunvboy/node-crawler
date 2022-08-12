const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: String,
    link: String,
    src: String,
})
module.exports = mongoose.model('category-products', schema);