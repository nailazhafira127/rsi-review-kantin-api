import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';
import { validate } from '../middlewares/validate.ts';
import { idParamSchema } from '../schemas/stallSchema.ts';
import { createReviewSchema } from '../schemas/resourceSchema.ts';

const router = Router();
const controller = new ReviewController();

router.get('/', controller.getAll);
router.post('/', validate(createReviewSchema, 'body'), controller.create);
router.delete('/:id', validate(idParamSchema, 'params'), controller.remove);

export { router as reviewRouter };