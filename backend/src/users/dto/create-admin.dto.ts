import { IsString, IsEmail, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../common/utils/regex.util';

export class CreateAdminDto {
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(PASSWORD_REGEX, {
    message: 'Password must contain at least 1 uppercase letter and 1 special character',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  address?: string;
}
