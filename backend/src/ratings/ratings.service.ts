import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { Store } from '../stores/store.entity';
import { User } from '../users/user.entity';
import { UserRole } from '../common/decorators/roles.decorator';
import { UpsertRatingDto } from './dto';
import { PaginationQueryDto } from '../common/dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async upsertRating(userId: string, upsertRatingDto: UpsertRatingDto): Promise<Rating> {
    const { storeId, rating } = upsertRatingDto;

    const store = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: ['owner'],
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.owner?.id === userId) {
      throw new ForbiddenException('Store owners cannot rate their own store');
    }

    const existingRating = await this.ratingRepository.findOne({
      where: { userId, storeId },
    });

    if (existingRating) {
      existingRating.rating = rating;
      return this.ratingRepository.save(existingRating);
    } else {
      const newRating = this.ratingRepository.create({
        userId,
        storeId,
        rating,
      });
      return this.ratingRepository.save(newRating);
    }
  }

  async getStoreRatings(storeId: string, paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;

    const [ratings, total] = await this.ratingRepository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.user', 'user')
      .where('rating.storeId = :storeId', { storeId })
      .orderBy('rating.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const ratingsWithUserInfo = ratings.map(rating => ({
      id: rating.id,
      rating: rating.rating,
      createdAt: rating.createdAt,
      user: {
        id: rating.user.id,
        email: rating.user.email,
        name: rating.user.name,
      },
    }));

    return {
      data: ratingsWithUserInfo,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async getUserRatings(userId: string, paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;

    const [ratings, total] = await this.ratingRepository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.store', 'store')
      .where('rating.userId = :userId', { userId })
      .orderBy('rating.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const ratingsWithStoreInfo = ratings.map(rating => ({
      id: rating.id,
      rating: rating.rating,
      createdAt: rating.createdAt,
      store: {
        id: rating.store.id,
        name: rating.store.name,
        address: rating.store.address,
      },
    }));

    return {
      data: ratingsWithStoreInfo,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async getRatingByUserAndStore(userId: string, storeId: string): Promise<Rating | null> {
    return this.ratingRepository.findOne({
      where: { userId, storeId },
    });
  }
}
