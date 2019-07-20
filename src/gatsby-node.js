const transformInlineImagesToStaticImages = require('./utils/transform-inline-images-to-static-images');
const getImageAttachments = require('./utils/get-image-attachments');

const _ = require(`lodash`)
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const { fluid } = require(`gatsby-plugin-sharp`)

exports.sourceNodes = async ({
                                 actions,
                                 getNode,
                                 store,
                                 cache,
                                 createNodeId,
                                 createContentDigest,
                                 reporter,

                                 getNodes,
                             },
  pluginOptions
) => {
    const { createNode, touchNode } = actions

    const {auth:_auth={}} = pluginOptions;

  const defaults = {
    maxWidth: 650,
    wrapperStyle: ``,
    backgroundColor: `white`,
    postTypes: ["post", "page"],
    withWebp: false,
    // linkImagesToOriginal: true,
    // showCaptions: false,
    // pathPrefix,
    // withWebp: false
  }

  const options = _.defaults(pluginOptions, defaults)

  const nodes = getNodes()

  // for now just get all posts and pages.
  // this will be dynamic later
  const entities = nodes.filter(
    node =>
      node.internal.owner === "gatsby-source-wordpress" &&
      options.postTypes.includes(node.type)
  )

    const attachments = getImageAttachments(entities);

  // we need to await transforming all the entities since we may need to get images remotely and generating fluid image data is async
  await Promise.all(
    entities.map(async entity =>
                     transformInlineImagesToStaticImages(
        {
            entity,
            store,
            cache,
            createNode,
            createNodeId,
            touchNode,
            getNode,
            _auth,
            reporter,
            attachments
        },
        options
      )
    )
  )
}








