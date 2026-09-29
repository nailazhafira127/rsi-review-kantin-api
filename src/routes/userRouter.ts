import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';
import { validate } from '../middlewares/validate.ts';
import { createUserSchema } from '../schemas/userSchema.ts';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', userController.getUsers);
userRouter.post('/', validate(createUserSchema, 'body'), userController.createUser);

export { userRouter };