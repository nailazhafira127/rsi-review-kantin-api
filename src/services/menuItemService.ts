import { NotFoundError } from '../errors/NotFoundError.ts';
import { MenuItemRepository } from '../repositories/menuItemRepository.ts';
import type { CreateMenuItemInput, UpdateMenuItemInput } from '../schemas/resourceSchema.ts';

export class MenuItemService {
  constructor(private readonly repository = new MenuItemRepository()) {}

  getMenuItems() {
    return this.repository.findAll();
  }

  async getMenuItem(id: number) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundError('Menu tidak ditemukan');
    return item;
  }

  async createMenuItem(input: CreateMenuItemInput) {
    const item = await this.repository.create(input);
    if (!item) throw new NotFoundError('Menu gagal dibuat');
    return item;
  }

  async updateMenuItem(id: number, input: UpdateMenuItemInput) {
    const item = await this.repository.update(id, input);
    if (!item) throw new NotFoundError('Menu tidak ditemukan');
    return item;
  }

  async deleteMenuItem(id: number) {
    const item = await this.repository.remove(id);
    if (!item) throw new NotFoundError('Menu tidak ditemukan');
    return item;
  }
}