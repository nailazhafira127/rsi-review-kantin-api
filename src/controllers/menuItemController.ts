import type { Request, Response } from 'express';
import { getValidated } from '../middlewares/validate.ts';
import type { IdParam } from '../schemas/stallSchema.ts';
import type { CreateMenuItemInput, UpdateMenuItemInput } from '../schemas/resourceSchema.ts';
import { MenuItemService } from '../services/menuItemService.ts';

export class MenuItemController {
  constructor(private readonly service = new MenuItemService()) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ status: 'success', data: await this.service.getMenuItems() });
  };
  getById = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    res.status(200).json({ status: 'success', data: await this.service.getMenuItem(id) });
  };
  create = async (_req: Request, res: Response): Promise<void> => {
    const input = getValidated<CreateMenuItemInput>(res, 'body');
    res.status(201).json({ status: 'success', data: await this.service.createMenuItem(input) });
  };
  update = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const input = getValidated<UpdateMenuItemInput>(res, 'body');
    res.status(200).json({ status: 'success', data: await this.service.updateMenuItem(id, input) });
  };
  remove = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    res.status(200).json({ status: 'success', data: await this.service.deleteMenuItem(id) });
  };
}