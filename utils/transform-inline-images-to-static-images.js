const cheerio = require('cheerio');

const replaceImage = require('./replace-image');

module.exports = async ({
  entity,
  cache,
  reporter,
  wpInlineImages
}, options) => {
  const field = entity.content;
  if (!field && typeof field !== 'string' || !field.includes('<img')) return;
  const $ = cheerio.load(field);
  const $imgs = $(`img`);

  if ($imgs.length === 0) {
    return;
  }

  const imageRefs = $imgs.map(function return$img() {
    return $(this);
  });
  const {
    baseUrl
  } = options;
  await Promise.all(imageRefs.map($img => replaceImage({
    wpInlineImages,
    $img,
    options,
    cache,
    reporter,
    baseUrl
  })));
  entity.content = $.html();
};