import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import { UserRepository } from '../repositories/userRepository.ts';
import type { CreateUserInput } from '../schemas/userSchema.ts';

const scrypt = promisify(scryptCallback);

export class UserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async getUsers() {
    return this.userRepository.findAll();
  }

  async createUser(input: CreateUserInput) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(input.password, salt, 64)) as Buffer;
    const passwordHash = `scrypt:${salt}:${derivedKey.toString('hex')}`;
    return this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });
  }
}