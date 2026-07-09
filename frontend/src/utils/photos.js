import heroImg from '../assets/photos/hero.jpg';
import hotelAtlasImg from '../assets/photos/hotel-atlas.jpg';
import hotelOceanImg from '../assets/photos/hotel-ocean.jpg';
import roomSimpleImg from '../assets/photos/room-simple.jpg';
import roomDoubleImg from '../assets/photos/room-double.jpg';
import roomSuiteImg from '../assets/photos/room-suite.jpg';
import roomFamilialeImg from '../assets/photos/room-familiale.jpg';

export const heroImage = heroImg;

const HOTEL_COVERS = [
  { match: /atlas/i, image: hotelAtlasImg },
  { match: /ocean/i, image: hotelOceanImg },
];

export function hotelCoverImage(hotelNom) {
  const found = HOTEL_COVERS.find((h) => h.match.test(hotelNom || ''));
  return found ? found.image : hotelAtlasImg;
}

const ROOM_IMAGES = {
  SIMPLE: roomSimpleImg,
  DOUBLE: roomDoubleImg,
  SUITE: roomSuiteImg,
  FAMILIALE: roomFamilialeImg,
};

export function roomTypeImage(type) {
  return ROOM_IMAGES[type] || roomDoubleImg;
}
