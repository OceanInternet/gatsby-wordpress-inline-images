const uuidv5 = require('uuid/v5');

const createRemoteFileNode = require('./create-remote-file-node');

const parseWpImagePath = require('./parse-wp-image-path');

module.exports = async (gatsby, {
  src
}) => {
  const {
    cache,
    getNode
  } = gatsby;
  const url = parseWpImagePath(src);
  let fileNode = null;
  const mediaDataCacheKey = uuidv5(url, uuidv5.URL);
  const cacheMediaData = await cache.get(mediaDataCacheKey);

  if (cacheMediaData) {
    fileNode = getNode(cacheMediaData.fileNodeID);
  }

  if (!fileNode) {
    fileNode = await createRemoteFileNode(gatsby, {
      mediaDataCacheKey,
      url
    });

    if (fileNode) {// console.info(`hit remote - ${url}`);
    }
  } else {// console.info(`hit cache  - ${url}`);
    }

  return fileNode;
};