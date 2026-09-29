import { Router } from 'express';
import { AuditLogController } from '../controllers/auditLogController.ts';
import { validate } from '../middlewares/validate.ts';
import { createAuditLogSchema } from '../schemas/resourceSchema.ts';

const router = Router();
const controller = new AuditLogController();

router.get('/', controller.getAll);
router.post('/', validate(createAuditLogSchema, 'body'), controller.create);

export { router as auditLogRouter };