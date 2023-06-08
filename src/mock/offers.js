import { offersByType } from './const';
import { getRandomSliceFromItems } from '../util';


const getRandomOffersIdsByType = (type) => {
  const currentTypeRandomOffers = getRandomSliceFromItems(
    offersByType.find((currentOffers) => currentOffers.type === type).offers);
  return currentTypeRandomOffers.map((offer) => offer.id);
};

const getOfferById = (type, offerId)=> offersByType.find((el)=>el.type === type).offers.find((offer)=>offer.id === offerId);

export {getRandomOffersIdsByType, getOfferById};
