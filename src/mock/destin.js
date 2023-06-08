import { descriptionPhrases, namesOfPlaces } from './const';
import { getRandomItemFromItems, createIDgenerator } from '../util';

const destinations = [];

const generatePictures = () => {
  const pictures = [];
  for (let i = 0; i < 6; i++) {
    const picture = {
      src: 'img/photos/2.jpg',
      description: getRandomItemFromItems(descriptionPhrases)
    };
    pictures.push(picture);
  }
  return pictures;
};

const generateDestinationId = createIDgenerator();

const generateDestinations = (n) => {
  for (let i = 0; i < n; i++) {
    const destination = {
      id: generateDestinationId(),
      description: getRandomItemFromItems(descriptionPhrases),
      name: getRandomItemFromItems(namesOfPlaces),
      pictures: generatePictures()
    };
    destinations.push(destination);
  }
};

export {generateDestinations, destinations};
