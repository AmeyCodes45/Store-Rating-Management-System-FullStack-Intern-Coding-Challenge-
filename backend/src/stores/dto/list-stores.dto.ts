import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto, SortFilterDto } from '../../common/dto';

export class ListStoresDto extends PaginationQueryDto implements SortFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
