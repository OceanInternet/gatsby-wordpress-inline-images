// this function removes wordpress iamge sizes from a string
module.exports = imgSrc => imgSrc.trim().replace(/([-_]\d+x\d+\.)/, '.');
