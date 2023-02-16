const router = require('express').Router();
const authenticate = require('../../../middleware/authenticate'); //require('../../../../middleware/authenticate'); //require('../../../middleware/authenticate');
const ctrl = require('./transaction-controller');
const myroute = '/pos';
const subroute = '/transaction';
//router.use(myroute, authenticate);

// router.get(myroute + subroute + '/active', ctrl.onlyActive.bind(ctrl));
router.get(myroute + subroute + '/all', ctrl.all.bind(ctrl));
router.get(myroute + subroute + '/test-trans', ctrl.check_trans.bind(ctrl));
router.post(myroute + subroute + '/touchscreen-paynow', ctrl.touchscreen_paynow.bind(ctrl));
router.post(myroute + subroute + '/grocery-paynow', ctrl.grocery_paynow.bind(ctrl));

router.post(myroute + subroute + '/order-paylater', ctrl.order_paylater.bind(ctrl));
router.patch(myroute + subroute + '/order-paylater-add-on', ctrl.order_paylater_add_on.bind(ctrl));
router.get(myroute + subroute + '/order-paylater-dashboard', ctrl.order_paylater_dashboard.bind(ctrl));
router.patch(myroute + subroute + '/order-paylater-payment', ctrl.order_paylater_payment.bind(ctrl));

router.patch(myroute + subroute + '/void-transaction', ctrl.void_transaction.bind(ctrl));
router.patch(myroute + subroute + '/void-transaction-line', ctrl.void_transaction_line.bind(ctrl));
router.get(myroute + subroute + '/view-specific', ctrl.view_specific.bind(ctrl));

router.get(myroute + subroute + '/reports-daily/', ctrl.reports_daily.bind(ctrl));
// router.delete(myroute + subroute + '/:id', ctrl.soft_delete.bind(ctrl));x

module.exports = router;
