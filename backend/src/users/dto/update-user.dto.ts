import { IsString, IsEmail, IsOptional, MinLength, MaxLength, Matches, IsEnum } from 'class-validator';
import { UserRole } from '../../common/decorators/roles.decorator';
import { PASSWORD_REGEX } from '../../common/utils/regex.util';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(PASSWORD_REGEX, {
    message: 'Password must contain at least 1 uppercase letter and 1 special character',
  })
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  address?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
