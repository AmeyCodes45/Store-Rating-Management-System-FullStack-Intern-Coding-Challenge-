import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (configService: ConfigService): JwtModuleOptions => {
  const secret = configService.get('JWT_ACCESS_SECRET');
  const expiresIn = configService.get('JWT_ACCESS_EXPIRES') || '15m';
  
  if (!secret) {
    console.warn('JWT_ACCESS_SECRET not found, using fallback');
  }
  
  return {
    secret: secret || 'fallback_jwt_secret',
    signOptions: {
      expiresIn,
    },
  };
};

export const getRefreshJwtConfig = (configService: ConfigService): JwtModuleOptions => {
  const secret = configService.get('JWT_REFRESH_SECRET');
  const expiresIn = configService.get('JWT_REFRESH_EXPIRES') || '7d';
  
  if (!secret) {
    console.warn('JWT_REFRESH_SECRET not found, using fallback');
  }
  
  return {
    secret: secret || 'fallback_refresh_jwt_secret',
    signOptions: {
      expiresIn,
    },
  };
};
