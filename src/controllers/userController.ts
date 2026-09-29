import type { Request, Response } from 'express';
import { getValidated } from '../middlewares/validate.ts';
import type { CreateUserInput } from '../schemas/userSchema.ts';
import { UserService } from '../services/userService.ts';

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  getUsers = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getUsers();
    res.status(200).json({ status: 'success', data: users });
  };

  createUser = async (_req: Request, res: Response): Promise<void> => {
    const body = getValidated<CreateUserInput>(res, 'body');
    const user = await this.userService.createUser(body);
    res.status(201).json({ status: 'success', data: user });
  };
}