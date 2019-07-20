const faker = require('faker');

module.exports.wpBlockImage = wpBlockImage;
module.exports.wpBlockGallery = wpBlockGallery;

function wpBlockGallery() {
    return `
<ul class="wp-block-gallery">
    <li class="blocks-gallery-item">
        ${wpBlockImage()}
    </li>
    <li class="blocks-gallery-item">
        ${wpBlockImage({showCaption:true})}
    </li>
</ul>
`;
}

function wpBlockImage({ className='wp-block-image', showCaption=false, }={}) {

    const caption = showCaption ? `\n<figcaption>${faker.lorem.words()}</figcaption>\n` : '';
    const wordpressId = faker.random.number();

    return `
<figure class="${className}">
    <a href="${faker.image.imageUrl()}">
        <img src="${faker.image.imageUrl()}" alt="${faker.lorem.words()}" data-id="${wordpressId}" class="wp-image-${wordpressId}">
    </a>${caption}
</figure>
    `;
}
