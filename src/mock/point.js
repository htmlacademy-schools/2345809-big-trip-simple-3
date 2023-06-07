import {getRandomItemFromItems, getRandomPrice, createIDgenerator} from '../util.js';
import {fromToDates, typesPoint } from './const.js';
import { destinations, generateDestinations } from './destin.js';
import { getRandomOffersIdsByType } from './offers.js';

const tripPoints = [];

const generateTripPointId = createIDgenerator();
const generateTripPoints = (n) => {
  for (let i = 0; i < n; i++) {
    const dates = getRandomItemFromItems(fromToDates);
    const type = getRandomItemFromItems(typesPoint);
    const tripPoint = {
      basePrice: getRandomPrice(),
      dateFrom: dates.dateFrom,
      dateTo: dates.dateTo,
      destination: getRandomItemFromItems(destinations).id,
      id: generateTripPointId(),
      offersIDs: getRandomOffersIdsByType(type),
      type
    };
    tripPoints.push(tripPoint);
  }
};

const mockInit = (numberOfTripPoints, numberOfDestinations) => {
  generateDestinations(numberOfDestinations);
  generateTripPoints(numberOfTripPoints);
};

export {mockInit, tripPoints};
