import express from 'express';
const router = express.Router();
import { home, jobForm, getMysqlData } from '../controller/apiController.js';


router.route('/form').post(jobForm);
router.route('/').get(home);
router.route('/all').get(getMysqlData);

export default router;
