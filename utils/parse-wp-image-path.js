// this function removes wordpress iamge sizes from a string
module.exports = imgSrc => imgSrc.trim().replace(/[-_]+\d+x\d+/g, '') // WP sizes
.replace(/[-_]+(\.\w+)$/, '$1') // trailing "-" or "_"
.replace(/^.+\/wp-content\/uploads\/(\d+\/\d+\/.+\.\w+)$/, 'wordpress/$1');