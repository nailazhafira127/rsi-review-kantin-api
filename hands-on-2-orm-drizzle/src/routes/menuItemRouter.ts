import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';
import { validate } from '../middlewares/validate.ts';
import { idParamSchema } from '../schemas/stallSchema.ts';
import { createMenuItemSchema, updateMenuItemSchema } from '../schemas/resourceSchema.ts';

const router = Router();
const controller = new MenuItemController();

router.get('/', controller.getAll);
router.post('/', validate(createMenuItemSchema, 'body'), controller.create);
router.get('/:id', validate(idParamSchema, 'params'), controller.getById);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateMenuItemSchema, 'body'), controller.update);
router.delete('/:id', validate(idParamSchema, 'params'), controller.remove);

export { router as menuItemRouter };