import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';
import { validate } from '../middlewares/validate.ts';
import { idParamSchema } from '../schemas/stallSchema.ts';
import { createLikeSchema } from '../schemas/resourceSchema.ts';

const router = Router();
const controller = new LikeController();

router.post('/', validate(createLikeSchema, 'body'), controller.create);
router.delete('/:id', validate(idParamSchema, 'params'), controller.remove);

export { router as likeRouter };