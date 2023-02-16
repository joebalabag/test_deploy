const router = require('express').Router();
const authenticate = require('../../../middleware/authenticate'); //require('../../../../middleware/authenticate'); //require('../../../middleware/authenticate');
const ctrl = require('./stock-issuance-controller');
const myroute = '/mms';
const subroute = '/stock-issuance';
//router.use(myroute, authenticate);

// router.get(myroute + subroute + '/dashboard-po', ctrl.dashboard_pr.bind(ctrl));
// router.get(myroute + subroute + '/dashboard-delivery', ctrl.dashboard_po.bind(ctrl));
// router.get(myroute + subroute + '/view', ctrl.view.bind(ctrl));
// router.post(myroute + subroute + '/create', ctrl.create.bind(ctrl));
// router.patch(myroute + subroute + '/post', ctrl.post.bind(ctrl));
// router.patch(myroute + subroute + '/void', ctrl.void.bind(ctrl));
// router.patch(myroute + subroute + '/update', ctrl.update.bind(ctrl));
// router.patch(myroute + subroute + '/approve', ctrl.approve.bind(ctrl));

module.exports = router;
