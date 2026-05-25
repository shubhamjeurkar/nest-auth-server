import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';

const BCRYPT_COST = 12;

interface CreateUserInput {
  email: string;
  password: string;
  role?: UserRole;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async create(input: CreateUserInput): Promise<User> {
    const normalizedEmail = input.email.trim().toLowerCase();

    const existing = await this.userModel.findOne({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST);

    return this.userModel.create({
      email: normalizedEmail,
      passwordHash,
      role: input.role ?? UserRole.USER,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email: email.trim().toLowerCase() },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async verifyPassword(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }
}