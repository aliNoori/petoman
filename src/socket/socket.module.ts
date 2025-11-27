import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from './message/message.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../shared/user/user.module';

@Module({
    imports: [
        MessageModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'my-secret-key',
            signOptions: { expiresIn: '1d' },
        }),
        UserModule,
    ],
    providers: [ChatGateway],
    exports: [ChatGateway],
})
export class SocketModule {}
