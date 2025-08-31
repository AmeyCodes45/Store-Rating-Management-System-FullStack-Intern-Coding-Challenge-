import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../common/utils/regex.util';

export class UpdatePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(PASSWORD_REGEX, {
    message: 'Password must contain at least 1 uppercase letter and 1 special character',
  })
  newPassword: string;
}
