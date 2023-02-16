const router = require('express').Router();
const authenticate = require('../../../middleware/authenticate'); //require('../../../../middleware/authenticate'); //require('../../../middleware/authenticate');
const ctrl = require('./menu-item-controller');
const myroute = '/maintenance';
const subroute = '/menu-item';
//router.use(myroute, authenticate);

router.get(myroute + subroute + '/active', ctrl.onlyActive.bind(ctrl));
router.get(myroute + subroute + '/all', ctrl.index.bind(ctrl));
router.get(myroute + subroute + '/show/:id', ctrl.show.bind(ctrl));
router.get(myroute + subroute + '/view-specific', ctrl.view_specific.bind(ctrl));
router.post(myroute + subroute + '/', ctrl.create.bind(ctrl));
router.patch(myroute + subroute + '/:id', ctrl.update.bind(ctrl));
router.delete(myroute + subroute + '/:id', ctrl.soft_delete.bind(ctrl));

//router.get(myroute + subroute + '/for-menu', ctrl.for_menu.bind(ctrl));
module.exports = router;
