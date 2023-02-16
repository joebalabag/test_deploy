const router = require('express').Router();
const authenticate = require('../../../middleware/authenticate'); //require('../../../../middleware/authenticate'); //require('../../../middleware/authenticate');
const ctrl = require('./journal-controller');
const myroute = '/ams';
const subroute = '/journal';
const upload = require('../../../helper/upload-folder');
//router.use(myroute, authenticate);

router.get(myroute + subroute + '/active', ctrl.onlyActive.bind(ctrl));
router.get(myroute + subroute + '/all', ctrl.all.bind(ctrl)); //index
router.get(myroute + subroute + '/show/:id', ctrl.show.bind(ctrl));
router.get(myroute + subroute + '/get-ref-num', ctrl.Last.bind(ctrl));
router.get(myroute + subroute + '/dashboard-summary', ctrl.dashboard_summary.bind(ctrl));
router.get(myroute + subroute + '/dashboard-main', ctrl.dashboard_main.bind(ctrl));
router.get(myroute + subroute + '/view-specific', ctrl.view_specific.bind(ctrl));
router.post(myroute + subroute + '/', ctrl.create.bind(ctrl));
router.post(
	myroute + subroute + '/documents/add',
	upload({ directory: 'journals/documents' }).fields([{ name: 'document_file' }]),
	ctrl.UploadDocuments.bind(ctrl)
);
router.patch(myroute + subroute + '/:id', ctrl.update.bind(ctrl));
router.delete(myroute + subroute + '/:id', ctrl.soft_delete.bind(ctrl));
module.exports = router;
