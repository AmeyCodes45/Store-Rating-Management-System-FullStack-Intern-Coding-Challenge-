import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../common/decorators/roles.decorator';
import { hashPassword } from '../common/utils/password.util';

async function seedAdmin() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const adminEmail = 'admin@store.com';
    const existingAdmin = await usersService.findOne(adminEmail).catch(() => null);

    if (!existingAdmin) {
      const hashedPassword = await hashPassword('AdminPass@123');
      
      await usersService.create({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        address: 'System HQ',
        role: UserRole.ADMIN,
      });

      console.log('✅ Default admin user created successfully');
      console.log('📧 Email: admin@store.com');
      console.log('🔑 Password: AdminPass@123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
