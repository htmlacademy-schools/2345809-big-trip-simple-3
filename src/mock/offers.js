import { getOffersByType, offersByType } from './const';
import { getRandomSliceFromItems } from '../util';


const getRandomOffersIdsByType = (type) => {
  const currentTypeRandomOffers = getRandomSliceFromItems(
    offersByType.find((currentOffers) => currentOffers.type === type).offers);
  return currentTypeRandomOffers.map((offer) => offer.id);
};

const getOfferById = (id, type) => (getOffersByType(type)
  .find((offer) => offer.id === id));

export {getRandomOffersIdsByType, getOfferById};
