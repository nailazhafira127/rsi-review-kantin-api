import { NotFoundError } from '../errors/NotFoundError.ts';
import { FlagRepository } from '../repositories/flagRepository.ts';
import type { UpdateFlagStatusInput } from '../schemas/resourceSchema.ts';

export class FlagService {
  constructor(private readonly repository = new FlagRepository()) {}

  getFlags() {
    return this.repository.findAll();
  }

  async updateStatus(id: number, input: UpdateFlagStatusInput) {
    const flag = await this.repository.updateStatus(id, input);
    if (!flag) throw new NotFoundError('Flag tidak ditemukan');
    return flag;
  }
}