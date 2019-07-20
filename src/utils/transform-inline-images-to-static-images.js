const replaceImage = require('./replace-image');
const cheerio = require('cheerio');

module.exports = async (
    { entity, cache, reporter, store, createNode, createNodeId, getNode, touchNode, _auth, attachments },
    options
) => {
    const field = entity.content

    if ((!field && typeof field !== "string") || !field.includes("<img")) return

    const $ = cheerio.load(field)

    const imgs = $(`img`)

    if (imgs.length === 0) return

    const imageRefs = []

    imgs.each(function() {
        imageRefs.push($(this))
    })

    await Promise.all(
        imageRefs.map($img =>
                          replaceImage(
                              {
                                  entity,
                                  $img,
                                  options,
                                  cache,
                                  reporter,
                                  $,
                                  store,
                                  createNode,
                                  createNodeId,
                                  getNode,
                                  touchNode,
                                  _auth,
                                  attachments
                              }, options)
        )
    )

    entity.content = $.html()
}
