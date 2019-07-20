const isImageAttachment = ({
  __type = '',
  type = '',
  media_type = ''
} = {}) => __type === 'wordpress__wp_media' && type === 'attachment' && media_type === 'image';

const getImageAttachments = (entities = []) => entities.filter(isImageAttachment);

module.exports = getImageAttachments;