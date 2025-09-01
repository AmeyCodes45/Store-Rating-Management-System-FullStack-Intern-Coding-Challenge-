import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto, UpdatePasswordDto } from './dto';
import { comparePassword, hashPassword } from '../common/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto, res: Response) {
    try {
      console.log('Login attempt for:', loginDto.email);
      
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
      });

      console.log('User found:', user ? 'Yes' : 'No');

      if (!user) {
        console.log('User not found');
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await comparePassword(loginDto.password, user.password);
      console.log('Password valid:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('Invalid password');
        throw new UnauthorizedException('Invalid credentials');
      }

      console.log('Generating tokens...');
      const tokens = await this.generateTokens(user);
      console.log('Tokens generated successfully');

      this.setRefreshTokenCookie(res, tokens.refreshToken);

      const result = {
        accessToken: tokens.accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          address: user.address,
        },
      };

      console.log('Login successful for:', user.email);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async refresh(user: any, res: Response) {
    const tokens = await this.generateTokens(user);
    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        address: user.address,
      },
    };
  }

  async logout(res: Response) {
    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !(await comparePassword(updatePasswordDto.currentPassword, user.password))) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.password = await hashPassword(updatePasswordDto.newPassword);
    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  }

  private async generateTokens(user: any) {
    try {
      console.log('Generating tokens for user:', user.email);
      
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      console.log('JWT secrets check:');
      console.log('ACCESS_SECRET:', this.configService.get('JWT_ACCESS_SECRET') ? 'SET' : 'NOT SET');
      console.log('REFRESH_SECRET:', this.configService.get('JWT_REFRESH_SECRET') ? 'SET' : 'NOT SET');

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRES') || '15m',
        }),
        this.jwtService.signAsync(payload, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRES') || '7d',
        }),
      ]);

      console.log('Tokens generated successfully');
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Token generation error:', error);
      throw error;
    }
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
