const React = require(`react`);
const ReactDOMServer = require(`react-dom/server`);
const { fluid } = require(`gatsby-plugin-sharp`);
const Img = require(`gatsby-image`);

// Takes a node and generates the needed images and then returns
// the needed HTML replacement for the image
module.exports = async ({ imageNode, options, cache, reporter }) => {
    if (!imageNode || !imageNode.absolutePath) {
        return null;
    }

    let fluidResultWebp;
    const fluidResult = await fluid({
        file: imageNode,
        args: {
            ...options,
            maxWidth: options.maxWidth,
        },
        reporter,
        cache,
    });

    if (options.withWebp) {
        fluidResultWebp = await fluid({
            file: imageNode,
            args: {
                ...options,
                maxWidth: options.maxWidth,
                toFormat: 'WEBP',
            },
            reporter,
            cache,
        });
    }

    if (!fluidResult) {
        return null;
    }

    if (options.withWebp) {
        fluidResult.srcSetWebp = fluidResultWebp.srcSet;
    }

    const imgOptions = {
        fluid: fluidResult,
        style: {
            maxWidth: '100%',
        },
        // Force show full image instantly
        loading: 'auto',
        critical: true,
        imgStyle: {
            opacity: 1,
        },
    };
    const ReactImgEl = React.createElement(Img.default, imgOptions, null);
    return ReactDOMServer.renderToString(ReactImgEl);
};
