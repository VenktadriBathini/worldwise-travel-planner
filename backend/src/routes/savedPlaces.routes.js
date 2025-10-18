const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { createSavedPlace, listSavedPlaces } = require('../controllers/savedPlaces.controller');

router.use(requireAuth);
router.post('/points/:pointId/saved-places', createSavedPlace);
router.get('/points/:pointId/saved-places', listSavedPlaces);

module.exports = router;
