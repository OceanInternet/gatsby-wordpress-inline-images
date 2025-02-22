const React = require(`react`);

const ReactDOMServer = require(`react-dom/server`);

const {
  fluid
} = require(`gatsby-plugin-sharp`);

const Img = require(`gatsby-image`);

module.exports = async (gatsby, {
  imageNode,
  options
}) => {
  const {
    cache,
    reporter
  } = gatsby;

  if (!imageNode || !imageNode.absolutePath) {
    return null;
  }

  let fluidResultWebp;
  const fluidResult = await fluid({
    file: imageNode,
    args: { ...options,
      maxWidth: options.maxWidth
    },
    reporter,
    cache
  });

  if (options.withWebp) {
    fluidResultWebp = await fluid({
      file: imageNode,
      args: { ...options,
        maxWidth: options.maxWidth,
        toFormat: 'WEBP'
      },
      reporter,
      cache
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
      maxWidth: '100%'
    },
    // Force show full image instantly
    loading: 'auto',
    critical: true,
    imgStyle: {
      opacity: 1
    }
  };
  const ReactImgEl = React.createElement(Img.default, imgOptions, null);
  return ReactDOMServer.renderToString(ReactImgEl);
};