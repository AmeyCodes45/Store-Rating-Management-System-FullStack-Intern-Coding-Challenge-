import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class UpsertRatingDto {
  @IsUUID()
  storeId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
