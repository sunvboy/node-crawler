
const request = require('request-promise');
const cheerio = require('cheerio');
const mongoDBConnect = require('./config/database');
const categoryProductModel = require('./schemas/category-product');
mongoDBConnect();
const getCategoryProduct = async () => {
    let linkSiteGet = 'https://www.anphatpc.com.vn/';
    try {
        let html = await request.get(linkSiteGet);
        let $ = await cheerio.load(html);
        $('.header-menu-holder .pro-cate-1').each((i, elm) => {
            let name = $(elm).children('span.title').text().trim().replace(/^\s+|\s+$/g, "");
            // let name = $(elm).attr('title');
            let link = $(elm).attr('href');
            let src = $(elm).find('img').attr('src');
            let item = { name, link, src };
            // console.log(elm);
            new categoryProductModel(item).save().then(() => {
                console.log('success');
            })
        });
    } catch (error) {
        console.log(error);
        return false;
    }
}
getCategoryProduct();