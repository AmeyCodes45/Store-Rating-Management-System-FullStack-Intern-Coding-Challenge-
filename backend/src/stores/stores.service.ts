import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { Rating } from '../ratings/rating.entity';
import { CreateStoreDto, UpdateStoreDto, ListStoresDto } from './dto';
import { User } from '../users/user.entity';
import { UserRole } from '../common/decorators/roles.decorator';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const owner = await this.userRepository.findOne({
      where: { id: createStoreDto.ownerId },
    });

    if (!owner) {
      throw new NotFoundException('Store owner not found');
    }

    if (owner.role !== UserRole.STORE_OWNER) {
      throw new BadRequestException('User must be a store owner');
    }

    const existingStore = await this.storeRepository.findOne({
      where: { ownerId: createStoreDto.ownerId },
    });

    if (existingStore) {
      throw new BadRequestException('User already owns a store');
    }

    const store = this.storeRepository.create(createStoreDto);
    return this.storeRepository.save(store);
  }

  async findAll(listStoresDto: ListStoresDto) {
    const { page = 1, limit = 10, search } = listStoresDto;

    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.owner', 'owner')
      .leftJoinAndSelect('store.ratings', 'ratings');

    if (search) {
      queryBuilder.where(
        '(store.name ILIKE :search OR store.address ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [stores, total] = await queryBuilder
      .orderBy('store.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const storesWithAvgRating = await Promise.all(
      stores.map(async (store) => {
        const avgRating = await this.calculateAverageRating(store.id);
        return {
          id: store.id,
          name: store.name,
          address: store.address,
          owner: {
            id: store.owner?.id,
            name: store.owner?.name,
            email: store.owner?.email,
          },
          averageRating: avgRating,
          totalRatings: store.ratings?.length || 0,
          createdAt: store.createdAt,
          updatedAt: store.updatedAt,
        };
      }),
    );

    return {
      data: storesWithAvgRating,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['owner', 'ratings'],
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    Object.assign(store, updateStoreDto);
    return this.storeRepository.save(store);
  }

  async remove(id: string): Promise<void> {
    const store = await this.findOne(id);
    await this.storeRepository.remove(store);
  }

  async getStoresCount(): Promise<{ total: number }> {
    const total = await this.storeRepository.count();
    return { total };
  }

  async calculateAverageRating(storeId: string): Promise<number> {
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'average')
      .where('rating.storeId = :storeId', { storeId })
      .getRawOne();

    return result.average ? parseFloat(result.average) : 0;
  }

  async getStoreAverageRating(storeId: string): Promise<{ average: number; total: number }> {
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'average')
      .addSelect('COUNT(rating.id)', 'total')
      .where('rating.storeId = :storeId', { storeId })
      .getRawOne();

    return {
      average: result.average ? parseFloat(result.average) : 0,
      total: parseInt(result.total) || 0,
    };
  }
}
