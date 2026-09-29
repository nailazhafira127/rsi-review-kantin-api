import type { Request, Response } from 'express';
import { getValidated } from '../middlewares/validate.ts';
import type { CreateAuditLogInput } from '../schemas/resourceSchema.ts';
import { AuditLogService } from '../services/auditLogService.ts';

export class AuditLogController {
  constructor(private readonly service = new AuditLogService()) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ status: 'success', data: await this.service.getAuditLogs() });
  };
  create = async (_req: Request, res: Response): Promise<void> => {
    const input = getValidated<CreateAuditLogInput>(res, 'body');
    res.status(201).json({ status: 'success', data: await this.service.createAuditLog(input) });
  };
}