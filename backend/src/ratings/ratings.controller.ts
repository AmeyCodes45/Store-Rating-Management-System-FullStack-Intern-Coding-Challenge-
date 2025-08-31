import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { UpsertRatingDto } from './dto';
import { PaginationQueryDto } from '../common/dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  upsertRating(@Body() upsertRatingDto: UpsertRatingDto, @CurrentUser() user: any) {
    return this.ratingsService.upsertRating(user.id, upsertRatingDto);
  }

  @Get('stores/:storeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN)
  getStoreRatings(
    @Param('storeId') storeId: string,
    @Query() paginationQuery: PaginationQueryDto,
    @CurrentUser() user: any,
  ) {
    if (user.role === UserRole.STORE_OWNER) {
      return this.ratingsService.getStoreRatings(storeId, paginationQuery);
    }
    return this.ratingsService.getStoreRatings(storeId, paginationQuery);
  }

  @Get('users/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  getUserRatings(
    @Param('userId') userId: string,
    @Query() paginationQuery: PaginationQueryDto,
    @CurrentUser() user: any,
  ) {
    if (user.role === UserRole.USER && user.id !== userId) {
      throw new Error('Insufficient permissions');
    }
    return this.ratingsService.getUserRatings(userId, paginationQuery);
  }
}
