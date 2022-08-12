const request = require('request-promise');
const cheerio = require('cheerio');
const getProductInCategory = async () => {
    let page = 100;
    for (i = 0; i < page; i++) {
        let linkCategory = `https://www.anphatpc.com.vn/may-tinh-xach-tay-laptop.html?page=${i + 1}`;
        try {
            let html = await request.get(linkCategory);
            let $ = await cheerio.load(html);
            if ($('.js-p-item').length > 0) {
                $('.js-p-item').each((i, elm) => {
                    let name = $(elm).find('h3').text();
                    let link = $(elm).find('.p-img').attr('href');
                    let src = $(elm).find('.fit-img').attr('data-src');
                    let price = $(elm).find('.price-container del').text().trim().replace(" đ", '');
                    let price_sale = $(elm).find('.price-container .p-price').text().trim().replace(" đ", '');
                    let item = { name, link, src, price, price_sale };
                    console.log(item);
                });
            } else {
                console.log('stop' + i + 1);
                break;
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    }

}
getProductInCategory();