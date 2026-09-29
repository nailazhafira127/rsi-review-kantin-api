import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { flags } from '../db/schema.ts';
import type { UpdateFlagStatusInput } from '../schemas/resourceSchema.ts';

export class FlagRepository {
  async findAll() {
    const db = await getDb();
    return db.select().from(flags).orderBy(flags.id);
  }

  async updateStatus(id: number, input: UpdateFlagStatusInput) {
    const db = await getDb();
    const rows = await db.update(flags).set(input).where(eq(flags.id, id)).output();
    return rows[0];
  }
}