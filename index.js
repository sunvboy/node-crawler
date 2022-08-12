const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const mongoDBConnect = require('./config/database');
const categoryProductModel = require('./schemas/category-product');
const productModel = require('./schemas/product');
mongoDBConnect();
const folder_image = './images/';
//download image
const downloadImg = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(folder_image + filename)).on('close', callback);
    });
};
//lấy mô tả
const getDescription = async (linkProduct) => {
    let html = await request.get(linkProduct);
    let $ = await cheerio.load(html);
    let description = $('.pro-info-summary').html();
    let content = $('.item-desc').html();
    let meta_title = $('title').text();
    let meta_description = $('meta[name="description"]').attr('content');
    let data = { description, content, meta_title, meta_description };
    return data;
}
const getProductInCategory = async (idCategory, nameCategory, link) => {
    let page = 100;
    let linkMain = 'https://www.anphatpc.com.vn';

    for (i = 0; i < page; i++) {
        let linkCategory = linkMain + link + `?page=${i + 1}`;
        try {
            let html = await request.get(linkCategory);
            let $ = await cheerio.load(html);
            let countItemProduct = $('.js-p-item').length;
            if (countItemProduct > 0) {
                for (k = 0; k < countItemProduct; k++) {
                    let name = $(`.js-p-item:eq(${k})`).find('h3').text();
                    let linkProduct = $(`.js-p-item:eq(${k})`).find('.p-img').attr('href');
                    let srcImage = $(`.js-p-item:eq(${k})`).find('.fit-img').attr('data-src');
                    let price = $(`.js-p-item:eq(${k})`).find('.price-container del').text().trim().replace(" đ", '');
                    let price_sale = $(`.js-p-item:eq(${k})`).find('.price-container .p-price').text().trim().replace(" đ", '');
                    let category_id = idCategory;
                    let category_title = nameCategory;
                    let productDetail = await getDescription(linkMain + linkProduct);
                    let description = productDetail.description;
                    let content = productDetail.content;
                    let meta_title = productDetail.meta_title;
                    let meta_description = productDetail.meta_description;
                    //download image
                    let ext = path.extname(srcImage);
                    let image_name = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5) + ext;
                    await downloadImg(srcImage, image_name, function () {
                        console.log('done');
                    });
                    //end
                    let item = { name, linkProduct, image_name, price, price_sale, category_id, category_title, description, content, meta_title, meta_description };
                    new productModel(item).save().then(() => {
                        console.log('success');
                    })
                }
            } else {
                console.log('stop' + (i + 1));
                break;
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    }

}
const getProductInAllCategory = async () => {
    let category = await categoryProductModel.find();
    for (let j = 0; j < category.length; j++) {
        getProductInCategory(category[j].id, category[j].name, category[j].link);
    }
}
getProductInAllCategory();