const getFileNode = require('./get-file-node');
const generateImagesAndUpdateNode = require('./generate-images-and-update-node');

module.exports = async (gatsby, { $img, options }) => {
    const { baseUrl } = options;
    const src = $img.attr('src').trim();

    const srcMatch = new RegExp(`^http(?:s)?://(?:www.)?${baseUrl.trim()}/wp-content/uploads/\\d+/\\d+/.+.\\w+$`);

    if (!src.match(srcMatch)) {
        return;
    }

    const imageNode = getFileNode(gatsby, { src }) || null;

    if (!imageNode) {
        console.error(`miss       - ${src}`);
        return;
    }

    const { ext: fileType } = imageNode;

    if (fileType !== `gif` && fileType !== `svg`) {
        const rawHTML = await generateImagesAndUpdateNode(gatsby, { imageNode, options });

        // Replace the image string
        if (rawHTML) {
            $img.replaceWith(rawHTML);
        }
    }
};
