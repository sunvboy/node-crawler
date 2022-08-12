const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: String,
    linkProduct: String,
    image_name: String,
    price: String,
    price_sale: String,
    category_id: String,
    category_title: String,
    description: String,
    content: String,
    meta_title: String,
    meta_description: String,
})
module.exports = mongoose.model('products', schema);