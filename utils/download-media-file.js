const uuidv5 = require('uuid/v5');

const {
  createRemoteFileNode
} = require(`gatsby-source-filesystem`);

module.exports = async ({
  entity,
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
  let fileNodeID;
  let mediaDataCacheKey;

  if (wordpressId) {
    mediaDataCacheKey = `wordpress-media-${wordpressId}`;
  } else {
    mediaDataCacheKey = uuidv5(url, uuidv5.URL);
  }

  const cacheMediaData = await cache.get(mediaDataCacheKey);

  if (cacheMediaData && entity.modified === cacheMediaData.modified) {
    fileNode = getNode(cacheMediaData.fileNodeID); // check if node still exists in cache
    // it could be removed if image was made private

    if (fileNode) {
      fileNodeID = cacheMediaData.fileNodeID;
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
        parentNodeId: entity.id,
        auth: _auth,
        reporter
      });

      if (fileNode) {
        await cache.set(mediaDataCacheKey, {
          fileNodeID,
          modified: entity.modified
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  return fileNode;
};