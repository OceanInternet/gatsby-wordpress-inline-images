const downloadMediaFile = require('./download-media-file');
const parseWPImagePath = require('./parse-wp-image-path');
const generateImagesAndUpdateNode = require('./generate-images-and-update-node');

module.exports = async ({
                                        thisImg,
                                        options,
                                        cache,
                                        store,
                                        createNode,
                                        createNodeId,
                                        reporter,
                                        $,
                                  getNode,
                                  touchNode,
                            attachments,
    _auth,
                                    }) => {

    // find the full size image that matches, throw away WP resizes
    const classes = thisImg.attr('class')
    const src = thisImg.attr("src");
    const url = parseWPImagePath(src) || '';

    if(!url.startsWith('http')) {
        return;
    }

    let [full, wordpressId=null] = /(?:wp-image-)(\d+)/g.exec(classes) || [];

    if(!wordpressId && url.includes('wp-content/uploads')) {
        const {wordpress_id:fileWordpressId=null} = attachments.find(attachment => {

            const {media_details:mediaDetails={}} = attachment;
            const {file} = mediaDetails;

            return url.includes(file);

        }) || {};

        wordpressId = fileWordpressId;
    }

    const imageNode = await downloadMediaFile({
                                                  wordpressId,
                                                  url,
                                                  cache,
                                                  store,
                                                  createNode,
                                                  createNodeId,
                                                  getNode,
                                                  touchNode,
                                                  reporter,
                                                  _auth,
                                              })

    if (!imageNode) return

    let formattedImgTag = {}
    formattedImgTag.url = thisImg.attr(`src`)
    formattedImgTag.classList = classes ? classes.split(" ") : []
    formattedImgTag.title = thisImg.attr(`title`)
    formattedImgTag.alt = thisImg.attr(`alt`)

    // if (parsedUrlData.width) formattedImgTag.width = parsedUrlData.width
    // if (parsedUrlData.height) formattedImgTag.height = parsedUrlData.height

    if (!formattedImgTag.url) return

    const fileType = imageNode.ext

    // Ignore gifs as we can't process them,
    // svgs as they are already responsive by definition
    if (fileType !== `gif` && fileType !== `svg`) {
        const rawHTML = await generateImagesAndUpdateNode({
                                                              formattedImgTag,
                                                              imageNode,
                                                              options,
                                                              cache,
                                                              reporter,
                                                              $,
                                                          })

        // Replace the image string
        if (rawHTML) thisImg.replaceWith(rawHTML)
    }
}
