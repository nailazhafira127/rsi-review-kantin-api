import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { menuItems, stalls } from '../db/schema.ts';
import type { CreateMenuItemInput, UpdateMenuItemInput } from '../schemas/resourceSchema.ts';

export class MenuItemRepository {
  async findAll() {
    const db = await getDb();
    return db
      .select({
        id: menuItems.id,
        stallId: menuItems.stallId,
        stallName: stalls.name,
        name: menuItems.name,
        price: menuItems.price,
        isAvailable: menuItems.isAvailable,
      })
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .orderBy(menuItems.id);
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db
      .select({
        id: menuItems.id,
        stallId: menuItems.stallId,
        stallName: stalls.name,
        name: menuItems.name,
        price: menuItems.price,
        isAvailable: menuItems.isAvailable,
      })
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .where(eq(menuItems.id, id));
    return rows[0];
  }

  async create(input: CreateMenuItemInput) {
    const db = await getDb();
    const rows = await db.insert(menuItems).output().values(input);
    return rows[0] ? this.findById(rows[0].id) : undefined;
  }

  async update(id: number, input: UpdateMenuItemInput) {
    const db = await getDb();
    const rows = await db.update(menuItems).set(input).where(eq(menuItems.id, id)).output();
    return rows[0] ? this.findById(id) : undefined;
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(menuItems).where(eq(menuItems.id, id)).output();
    return rows[0];
  }

  async findByStallId(stallId: number) {
    const db = await getDb();
    return db.select().from(menuItems).where(eq(menuItems.stallId, stallId)).orderBy(menuItems.id);
  }
}