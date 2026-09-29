import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { reviews, users } from '../db/schema.ts';
import type { CreateReviewInput } from '../schemas/resourceSchema.ts';

export class ReviewRepository {
  async findAll() {
    const db = await getDb();
    return db
      .select({
        id: reviews.id,
        stallId: reviews.stallId,
        userId: reviews.userId,
        userName: users.name,
        rating: reviews.rating,
        comment: reviews.comment,
        likeCount: reviews.likeCount,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .orderBy(reviews.id);
  }

  async create(input: CreateReviewInput) {
    const db = await getDb();
    const rows = await db.insert(reviews).output().values({
      ...input,
      comment: input.comment ?? null,
      likeCount: 0,
    });
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(reviews).where(eq(reviews.id, id)).output();
    return rows[0];
  }
}