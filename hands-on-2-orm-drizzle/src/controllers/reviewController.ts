import type { Request, Response } from 'express';
import { getValidated } from '../middlewares/validate.ts';
import type { IdParam } from '../schemas/stallSchema.ts';
import type { CreateReviewInput } from '../schemas/resourceSchema.ts';
import { ReviewService } from '../services/reviewService.ts';

export class ReviewController {
  constructor(private readonly service = new ReviewService()) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ status: 'success', data: await this.service.getReviews() });
  };
  create = async (_req: Request, res: Response): Promise<void> => {
    const input = getValidated<CreateReviewInput>(res, 'body');
    res.status(201).json({ status: 'success', data: await this.service.createReview(input) });
  };
  remove = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    res.status(200).json({ status: 'success', data: await this.service.deleteReview(id) });
  };
}