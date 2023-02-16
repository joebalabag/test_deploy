const router = require('express').Router();
const authenticate = require('../../../middleware/authenticate'); //require('../../../../middleware/authenticate'); //require('../../../middleware/authenticate');
const ctrl = require('./item-group-controller');
const myroute = '/maintenance';
const subroute = '/item-group';
//router.use(myroute, authenticate);

router.get(myroute + subroute + '/active', ctrl.onlyActive.bind(ctrl));
router.get(myroute + subroute + '/all', ctrl.all.bind(ctrl)); //index
router.get(myroute + subroute + '/show/:id', ctrl.show.bind(ctrl));
router.get(myroute + subroute + '/view-specific', ctrl.view_specific.bind(ctrl));
router.post(myroute + subroute + '/', ctrl.create.bind(ctrl));
router.patch(myroute + subroute + '/:id', ctrl.update.bind(ctrl));
router.delete(myroute + subroute + '/:id', ctrl.soft_delete.bind(ctrl));
module.exports = router;
