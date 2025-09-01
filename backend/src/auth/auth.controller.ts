import { Controller, Post, Patch, Body, UseGuards, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, UpdatePasswordDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto, res);
    return res.json({ data: result });
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Body() refreshDto: RefreshDto, @CurrentUser() user: any, @Res() res: Response) {
    const result = await this.authService.refresh(user, res);
    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response) {
    const result = await this.authService.logout(res);
    return result;
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: any,
  ) {
    const result = await this.authService.updatePassword(user.id, updatePasswordDto);
    return result;
  }
}
