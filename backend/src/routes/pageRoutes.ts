import { Router } from 'express';
import { createPage, getPages, getPageBySlug, updatePage, getPageById } from '../controllers/pageController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticate, createPage);
router.get('/', authenticate, getPages);
router.get('/id/:id', authenticate, getPageById);
router.get('/:slug', getPageBySlug);
router.put('/:id', authenticate, updatePage);

export default router;
