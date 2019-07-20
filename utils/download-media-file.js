const moment = require('moment');

const uuidv5 = require('uuid/v5');

const {
  createRemoteFileNode
} = require(`gatsby-source-filesystem`);

module.exports = async ({
  wordpressId = null,
  url,
  cache,
  store,
  createNode,
  createNodeId,
  getNode,
  touchNode,
  reporter,
  _auth
}) => {
  let fileNode;
  let mediaDataCacheKey;

  if (wordpressId) {
    mediaDataCacheKey = `wordpress-media-${wordpressId}`;
  } else {
    mediaDataCacheKey = uuidv5(url, uuidv5.URL);
  }

  let {
    fileNodeID = null
  } = (await cache.get(mediaDataCacheKey)) || {}; // If we have cached media data and it wasn't modified, reuse
  // previously created file node to not try to re-download

  if (fileNodeID) {
    fileNode = getNode(fileNodeID); // check if node still exists in cache
    // it could be removed if image was made private

    if (fileNode) {
      touchNode({
        nodeId: fileNodeID
      });
    }
  } // If we don't have cached data, download the file


  if (!fileNodeID) {
    try {
      fileNode = await createRemoteFileNode({
        url,
        store,
        cache,
        createNode,
        createNodeId,
        // parentNodeId: e.id,
        auth: _auth,
        reporter
      });

      if (fileNode) {
        let {
          id: fileNodeID
        } = fileNode;
        const modified = moment().format();
        await cache.set(mediaDataCacheKey, {
          fileNodeID,
          modified
        }); // console.log('set cached image', mediaDataCacheKey);
      } else {// console.log('could not createRemoteFileNode', mediaDataCacheKey);
        }
    } catch (e) {
      console.error(e);
    }
  } else {// console.log('got cached image', mediaDataCacheKey);
  }

  return fileNode;
};