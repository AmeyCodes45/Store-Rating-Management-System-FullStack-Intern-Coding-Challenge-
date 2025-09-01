import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, CreateAdminDto } from './dto';
import { PaginationQueryDto, SortFilterDto } from '../common/dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result = await this.usersService.create(createUserDto);
    return res.json({ data: result });
  }

  @Post('admin')
  @Roles(UserRole.ADMIN)
  async createAdmin(@Body() createAdminDto: CreateAdminDto, @Res() res: Response) {
    const result = await this.usersService.createAdmin(createAdminDto);
    return res.json({ data: result });
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query() paginationQuery: PaginationQueryDto, @Query() sortFilter: SortFilterDto) {
    return this.usersService.findAll(paginationQuery, sortFilter);
  }

  @Get('count')
  @Roles(UserRole.ADMIN)
  getCount() {
    return this.usersService.getUsersCount();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() currentUser: any) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new Error('Insufficient permissions');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
