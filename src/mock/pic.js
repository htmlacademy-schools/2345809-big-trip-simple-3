import { getRandomPic, getRandomArrayElement } from '../util';
import { descriptionPhrases } from './const';

const createPictures = () => ({
  src: getRandomPic(),
  description: getRandomArrayElement(descriptionPhrases)
});

export {createPictures};
