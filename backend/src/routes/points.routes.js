const router = require('express').Router({ mergeParams: true });
const { requireAuth } = require('../middleware/auth');
const { addPoint, listPoints } = require('../controllers/points.controller');

router.use(requireAuth);
router.post('/:tripId/points', addPoint);
router.get('/:tripId/points', listPoints);

module.exports = router;
