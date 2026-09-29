import type { Request, Response } from 'express';
import { getValidated } from '../middlewares/validate.ts';
import type { IdParam } from '../schemas/stallSchema.ts';
import type { UpdateFlagStatusInput } from '../schemas/resourceSchema.ts';
import { FlagService } from '../services/flagService.ts';

export class FlagController {
  constructor(private readonly service = new FlagService()) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ status: 'success', data: await this.service.getFlags() });
  };
  updateStatus = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const input = getValidated<UpdateFlagStatusInput>(res, 'body');
    res.status(200).json({ status: 'success', data: await this.service.updateStatus(id, input) });
  };
}