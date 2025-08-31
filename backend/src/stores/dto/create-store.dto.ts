import { IsString, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  address?: string;

  @IsUUID()
  ownerId: string;
}
