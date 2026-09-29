import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';
import { validate } from '../middlewares/validate.ts';
import { idParamSchema } from '../schemas/stallSchema.ts';
import { flagStatusSchema } from '../schemas/resourceSchema.ts';

const router = Router();
const controller = new FlagController();

router.get('/', controller.getAll);
router.put('/:id', validate(idParamSchema, 'params'), validate(flagStatusSchema, 'body'), controller.updateStatus);

export { router as flagRouter };