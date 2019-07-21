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

  const imageRefs = [];
  $imgs.each(function return$img() {
    imageRefs.push($(this));
  });
  const {
    baseUrl
  } = options;
  console.info(`Got ${$imgs.length} images for ${entity.wordpress_id}`);
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