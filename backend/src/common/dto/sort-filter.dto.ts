import { IsOptional, IsString, IsIn } from 'class-validator';

export class SortFilterDto {
  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  filterBy?: string;
}
