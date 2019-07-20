const transformInlineImagesToStaticImages = require('./utils/transform-inline-images-to-static-images');

exports.sourceNodes = async ({
  cache,
  reporter,
  getNodes
}, pluginOptions) => {
  const defaults = {
    maxWidth: 650,
    wrapperStyle: ``,
    backgroundColor: `white`,
    postTypes: ['post', 'page'] // linkImagesToOriginal: true,
    // showCaptions: false,
    // pathPrefix,
    // withWebp: false

  };
  const options = { ...defaults,
    ...pluginOptions
  };
  const nodes = getNodes(); // for now just get all posts and pages.
  // this will be dynamic later

  const wpInlineImages = nodes.filter(({
    internal = {},
    type = ''
  }) => {
    const {
      owner = '',
      mediaType = ''
    } = internal;
    return owner === 'gatsby-source-filesystem' && type === 'File' && mediaType.startsWith('image');
  });
  const entities = nodes.filter(({
    internal = {},
    type = ''
  }) => {
    const {
      owner = ''
    } = internal;
    const {
      postTypes = []
    } = options || {};
    return owner === 'gatsby-source-wordpress' && postTypes.includes(type);
  }); // we need to await transforming all the entities since we may need to get images remotely and generating fluid image data is async

  await Promise.all(entities.map(async entity => transformInlineImagesToStaticImages({
    entity,
    cache,
    reporter,
    wpInlineImages
  }, options)));
};