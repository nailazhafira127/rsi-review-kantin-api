import { NotFoundError } from '../errors/NotFoundError.ts';
import { ReviewRepository } from '../repositories/reviewRepository.ts';
import type { CreateReviewInput } from '../schemas/resourceSchema.ts';

export class ReviewService {
  constructor(private readonly repository = new ReviewRepository()) {}

  getReviews() {
    return this.repository.findAll();
  }

  async createReview(input: CreateReviewInput) {
    const review = await this.repository.create(input);
    if (!review) throw new NotFoundError('Review gagal dibuat');
    return review;
  }

  async deleteReview(id: number) {
    const review = await this.repository.remove(id);
    if (!review) throw new NotFoundError('Review tidak ditemukan');
    return review;
  }
}