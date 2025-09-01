import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { Rating } from '../ratings/rating.entity';
import { CreateStoreDto, UpdateStoreDto, ListStoresDto } from './dto';
import { User } from '../users/user.entity';
import { UserRole } from '../common/decorators/roles.decorator';
import { hashPassword } from '../common/utils/password.util';

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

  async create(createStoreDto: CreateStoreDto): Promise<{ store: Store; owner: User; credentials: { email: string; password: string } }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createStoreDto.ownerEmail },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await hashPassword(createStoreDto.ownerPassword);
    const owner = this.userRepository.create({
      name: createStoreDto.ownerName,
      email: createStoreDto.ownerEmail,
      password: hashedPassword,
      address: createStoreDto.ownerAddress,
      role: UserRole.STORE_OWNER,
    });

    const savedOwner = await this.userRepository.save(owner);

    const store = this.storeRepository.create({
      name: createStoreDto.name,
      address: createStoreDto.address,
      ownerId: savedOwner.id,
    });

    const savedStore = await this.storeRepository.save(store);

    return {
      store: savedStore,
      owner: savedOwner,
      credentials: {
        email: createStoreDto.ownerEmail,
        password: createStoreDto.ownerPassword,
      },
    };
  }

  async findAll(listStoresDto: ListStoresDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = listStoresDto;

    let stores: Store[];
    let total: number;

    if (sortBy === 'averageRating') {
      // Get total count first
      const countQuery = this.storeRepository.createQueryBuilder('store');
      if (search) {
        countQuery.where('(store.name ILIKE :search OR store.address ILIKE :search)', { search: `%${search}%` });
      }
      total = await countQuery.getCount();

      // Get all stores first, then sort by rating in memory
      const allStoresQuery = this.storeRepository
        .createQueryBuilder('store')
        .leftJoinAndSelect('store.owner', 'owner');
      
      if (search) {
        allStoresQuery.where('(store.name ILIKE :search OR store.address ILIKE :search)', { search: `%${search}%` });
      }

      const allStores = await allStoresQuery.getMany();

      // Calculate ratings and sort
      const storesWithRatings = await Promise.all(
        allStores.map(async (store) => {
          const ratingData = await this.getStoreAverageRating(store.id);
          return {
            ...store,
            averageRating: ratingData.average,
            totalRatings: ratingData.total,
          };
        })
      );

      // Sort by average rating
      storesWithRatings.sort((a, b) => {
        if (sortOrder === 'ASC') {
          return a.averageRating - b.averageRating;
        } else {
          return b.averageRating - a.averageRating;
        }
      });

      // Apply pagination
      const startIndex = (page - 1) * limit;
      stores = storesWithRatings.slice(startIndex, startIndex + limit);
    } else {
      // Regular sorting for other fields
      const queryBuilder = this.storeRepository
        .createQueryBuilder('store')
        .leftJoinAndSelect('store.owner', 'owner');

      if (search) {
        queryBuilder.where('(store.name ILIKE :search OR store.address ILIKE :search)', { search: `%${search}%` });
      }

      queryBuilder.orderBy(`store.${sortBy}`, sortOrder as 'ASC' | 'DESC');

      const [storeResults, totalCount] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      stores = storeResults;
      total = totalCount;

      // Add rating data for non-rating sorted results
      const storesWithRatings = await Promise.all(
        stores.map(async (store) => {
          const ratingData = await this.getStoreAverageRating(store.id);
          return {
            ...store,
            averageRating: ratingData.average,
            totalRatings: ratingData.total,
          };
        })
      );

      stores = storesWithRatings;
    }

    return {
      data: stores,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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
