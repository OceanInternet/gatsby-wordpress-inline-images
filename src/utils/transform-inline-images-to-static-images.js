const cheerio = require('cheerio');
const replaceImage = require('./replace-image');

module.exports = async (gatsby, { entity, options }) => {
    const field = entity.content;

    if ((!field && typeof field !== 'string') || !field.includes('<img')) return;

    const $ = cheerio.load(field);

    const $imgs = $(`img`);

    if ($imgs.length === 0) {
        return;
    }

    const imageRefs = [];

    $imgs.each(function return$img() {
        imageRefs.push($(this));
    });

    await Promise.all(imageRefs.map($img => replaceImage(gatsby, { $img, options })));

    entity.content = $.html();
};
