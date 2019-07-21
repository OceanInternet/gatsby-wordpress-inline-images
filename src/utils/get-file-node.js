const createRemoteFileNode = require('./create-remote-file-node');
const parseWpImagePath = require('./parse-wp-image-path');

module.exports = async (gatsby, { src }) => {
    const { cache, getNode } = gatsby;

    const url = parseWpImagePath(src);

    let fileNode = null;

    const mediaDataCacheKey = Buffer.from(url).toString('base64');
    const cacheMediaData = await cache.get(mediaDataCacheKey);

    if (cacheMediaData) {
        fileNode = getNode(cacheMediaData.fileNodeID);
    }

    if (!fileNode) {
        fileNode = await createRemoteFileNode(gatsby, { mediaDataCacheKey, url });

        if (fileNode) {
            // console.info(`hit remote - ${url}`);
        }
    } else {
        console.info(`hit cache  - ${url}`);
    }

    return fileNode;
};
