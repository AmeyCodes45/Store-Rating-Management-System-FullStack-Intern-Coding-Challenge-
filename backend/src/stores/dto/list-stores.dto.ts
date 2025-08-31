import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto, SortFilterDto } from '../../common/dto';

export class ListStoresDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
