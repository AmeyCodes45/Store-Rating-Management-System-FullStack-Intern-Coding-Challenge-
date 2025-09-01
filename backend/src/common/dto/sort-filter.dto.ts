import { IsOptional, IsString, IsIn, IsEnum } from 'class-validator';
import { UserRole } from '../decorators/roles.decorator';

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
  @IsEnum(UserRole)
  filterBy?: UserRole;

  @IsOptional()
  @IsString()
  emailFilter?: string;

  @IsOptional()
  @IsString()
  addressFilter?: string;
}
