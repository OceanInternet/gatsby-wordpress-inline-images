const parseWPImagePath = require('./parse-wp-image-path');

const generateImagesAndUpdateNode = require('./generate-images-and-update-node');

module.exports = async ({
  wpInlineImages,
  $img,
  options,
  cache,
  reporter,
  baseUrl
}) => {
  // find the full size image that matches, throw away WP resizes
  const src = $img.attr('src').trim();
  const srcMatch = new RegExp(`^http(?:s)?://(?:www.)?${baseUrl.trim()}/wp-content/uploads/\\d+/\\d+/.+.\\w+$`);

  if (!src.match(srcMatch)) {
    return;
  }

  const filePath = parseWPImagePath(src) || '';
  const imageNode = wpInlineImages.find(({
    relativePath
  }) => filePath === relativePath) || null;

  if (!imageNode) {
    return;
  }

  const {
    ext: fileType
  } = imageNode; // Ignore gifs as we can't process them,
  // svgs as they are already responsive by definition

  if (fileType !== `gif` && fileType !== `svg`) {
    const rawHTML = await generateImagesAndUpdateNode({
      imageNode,
      options,
      cache,
      reporter
    }); // Replace the image string

    if (rawHTML) {
      $img.replaceWith(rawHTML);
    }
  }
};