import { Router } from 'express';
import { addFavorite, getFavorites, getStations, removeFavorite } from '../controllers/radioController.js';

const router = Router();

router.get('/stations', getStations);
router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:stationuuid', removeFavorite);

export default router;
