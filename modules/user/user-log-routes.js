const router = require('express').Router();
const authenticate = require('../../middleware/authenticate');
const ctrl = require('./user-log-controller');
const myroute = '/user-log';
const subroute = '/dashboard';
router.use(myroute, authenticate);
router.get(myroute + subroute + '/:dateFrom/:dateTo/:keywords?', ctrl.Dashboard.bind(ctrl));

module.exports = router;
