const { createRemoteFileNode } = require(`gatsby-source-filesystem`);
const moment = require('moment');

module.exports = async (gatsby, { mediaDataCacheKey, url }) => {
    const { store, cache, actions, createNodeId } = gatsby;
    const { createNode } = actions;

    let fileNode = null;

    try {
        fileNode = await createRemoteFileNode({
            url,
            store,
            cache,
            createNode,
            createNodeId,
        });

        if (fileNode) {
            const { fileNodeID } = fileNode;

            await cache.set(mediaDataCacheKey, {
                fileNodeID,
                modified: moment().format(),
            });
        }
    } catch (error) {
        console.error(error);
    }

    return fileNode;
};
