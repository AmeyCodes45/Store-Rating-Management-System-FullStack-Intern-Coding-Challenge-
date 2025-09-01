import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from '../common/decorators/roles.decorator';
import { CreateUserDto, UpdateUserDto, CreateAdminDto, UpdatePasswordDto } from './dto';
import { PaginationQueryDto, SortFilterDto } from '../common/dto';
import { hashPassword } from '../common/utils/password.util';
import { comparePassword } from '../common/utils/password.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await hashPassword(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      role: createUserDto.role || UserRole.USER,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<{ admin: User; credentials: { email: string; password: string } }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createAdminDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await hashPassword(createAdminDto.password);
    const admin = this.userRepository.create({
      ...createAdminDto,
      role: UserRole.ADMIN,
      password: hashedPassword,
    });

    const savedAdmin = await this.userRepository.save(admin);

    return {
      admin: savedAdmin,
      credentials: {
        email: createAdminDto.email,
        password: createAdminDto.password,
      },
    };
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
    sortFilter: SortFilterDto,
  ) {
    const { page = 1, limit = 10 } = paginationQuery;
    const { sortBy = 'createdAt', sortOrder = 'DESC', search, filterBy } = sortFilter;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.where(
        '(user.name ILIKE :search OR user.email ILIKE :search OR user.address ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (filterBy) {
      queryBuilder.andWhere('user.role = :filterBy', { filterBy });
    }

    const [users, total] = await queryBuilder
      .orderBy(`user.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async getUsersCount(): Promise<{ total: number; byRole: Record<UserRole, number> }> {
    const total = await this.userRepository.count();
    
    const byRole = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    const roleCounts = {
      [UserRole.ADMIN]: 0,
      [UserRole.STORE_OWNER]: 0,
      [UserRole.USER]: 0,
    };

    byRole.forEach(item => {
      roleCounts[item.role] = parseInt(item.count);
    });

    return { total, byRole: roleCounts };
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<void> {
    const user = await this.findOne(userId);

    const isCurrentPasswordValid = await comparePassword(updatePasswordDto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await hashPassword(updatePasswordDto.newPassword);
    user.password = hashedNewPassword;
    await this.userRepository.save(user);
  }
}
