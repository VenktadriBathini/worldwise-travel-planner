const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/trips', require('./trips.routes'));
router.use('/', require('./points.routes'));        // /trips/:tripId/points
router.use('/', require('./savedPlaces.routes'));   // /points/:pointId/saved-places

module.exports = router;
