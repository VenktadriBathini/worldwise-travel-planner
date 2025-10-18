const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { createTrip, listMyTrips, getTrip, patchTrip, deleteTrip } = require('../controllers/trips.controller');

router.use(requireAuth);
router.post('/', createTrip);
router.get('/', listMyTrips);
router.get('/:tripId', getTrip);
router.patch('/:tripId', patchTrip);
router.delete('/:tripId', deleteTrip);

module.exports = router;
