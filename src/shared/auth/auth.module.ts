import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategies/jwt.strategy";
import { CacheModule } from '@nestjs/cache-manager';
import {SmsModule} from "../gateways/sms/sms.module";

@Module({
  imports: [
    UserModule,
      SmsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'my-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    CacheModule.register({
      ttl: 300, // عمر OTP در ثانیه (اینجا 5 دقیقه)
      isGlobal: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy]
})
export class AuthModule {}
