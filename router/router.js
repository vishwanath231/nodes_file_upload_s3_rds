import express from 'express';
const router = express.Router();
import { home, jobForm } from '../controller/apiController.js';


router.route('/form').post(jobForm);
router.route('/').get(home);


export default router;