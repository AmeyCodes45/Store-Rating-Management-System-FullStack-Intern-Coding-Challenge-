import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { StoresService } from './stores.service';
import { CreateStoreDto, UpdateStoreDto, ListStoresDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createStoreDto: CreateStoreDto, @Res() res: Response) {
    const result = await this.storesService.create(createStoreDto);
    return res.json({ data: result });
  }

  @Get()
  async findAll(@Query() listStoresDto: ListStoresDto, @Res() res: Response) {
    const result = await this.storesService.findAll(listStoresDto);
    return res.json({ data: result });
  }

  @Get('count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getCount(@Res() res: Response) {
    const result = await this.storesService.getStoresCount();
    return res.json({ data: result });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.storesService.findOne(id);
    return res.json({ data: result });
  }

  @Get(':id/average')
  async getAverageRating(@Param('id') id: string, @Res() res: Response) {
    const result = await this.storesService.getStoreAverageRating(id);
    return res.json({ data: result });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto, @Res() res: Response) {
    const result = await this.storesService.update(id, updateStoreDto);
    return res.json({ data: result });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.storesService.remove(id);
    return res.json({ data: result });
  }
}
