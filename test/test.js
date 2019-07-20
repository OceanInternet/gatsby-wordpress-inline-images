const faker = require('faker');
const {wpBlockGallery} = require('./wp-block-image');
const cheerio = require('cheerio');

const field = wpBlockGallery();

const $ = cheerio.load(field);
const images = $(`img`);
const refs = [];

images.each(function (){ refs.push($(this));});

const [image] = refs;

console.log(image.attr("src"));

// console.log({src, classNames, attributes});
//
// classNames.push(faker.lorem.slug());
//
// content = `<img src="${src}" class="${classNames.join(' ')}">`;
//
// console.log({classNames, content});
//
// image.set_content(content);
//
// console.log();
//
// console.log(root.toString())
