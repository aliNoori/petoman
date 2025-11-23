import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import {MessageService} from "./message/message.service";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../shared/user/user.service";
import {Message} from "./message/message.entity";

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // userId → socketId
  constructor(private readonly messageService: MessageService,
              private readonly jwtService: JwtService,
              private readonly userService:UserService) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.query?.token as string;

    try {
      const payload = this.jwtService.verify(token);
      console.log('✅ اتصال کاربر با شناسه:', payload.userId);
      // می‌تونی userId رو توی client ذخیره کنی
      client.data.userId = payload.userId;
      const userId = payload.userId;
      this.connectedUsers.set(userId, client.id);
      await this.userService.setOnlineStatus(userId, true);
      console.log(`🟢 کاربر ${userId} آنلاین شد`);
      const undeliveredMessages = await this.messageService.getPendingMessages(userId);

      for (const msg of undeliveredMessages) {
        this.server.to(client.id).emit('private-message', {
          senderId: msg.senderId,
          text: msg.text,
        });

        await this.messageService.markAsDelivered(msg.id);
      }


      // ارسال اطلاع به بقیه
      this.server.emit('user-online', {userId} as any);

    } catch (err) {
      console.log('❌ توکن نامعتبر:', err.message);
      client.disconnect();
    }
  }
  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    this.connectedUsers.delete(userId);
    await this.userService.setOnlineStatus(userId, false);

    console.log(`🔴 کاربر ${userId} آفلاین شد`);

    this.server.emit('user-offline', {userId} as any);
  }
  @SubscribeMessage('private-message')
  async handlePrivateMessage(
      @ConnectedSocket() client: Socket,
      @MessageBody() payload: {receiverId: string; text: string }
  ) {

    const receiverSocketId = this.connectedUsers.get(payload.receiverId);
    const userId = client.data.userId;

    if (receiverSocketId) {

      this.server.to(receiverSocketId).emit('private-message', {
        receiverId: payload.receiverId,//payload.senderId,
        text: payload.text,
      });
      await this.messageService.save({...payload,senderId:userId,isDelivered: !!receiverSocketId,});

    } else {

      client.emit('error', `کاربر ${payload.receiverId} آنلاین نیست`);
      await this.messageService.save({...payload,senderId:userId,isDelivered: !!receiverSocketId,});

    }
  }
  @SubscribeMessage('message-seen')
  async handleSeen(
      @MessageBody() data: { messageId: string },
      @ConnectedSocket() client: Socket
  ) {
    await this.messageService.markAsSeen(data.messageId);
    console.log(`👁 پیام ${data.messageId} توسط ${client.data.userId} دیده شد`);

    // دریافت پیام اصلی
    const message = await this.messageService.findById(data.messageId);
    if (!message) return; // هندل خطا یا پیام پیدا نشد

    const senderId = message.senderId;
    const senderSocketId = this.connectedUsers.get(senderId);

    if (senderSocketId) {
      this.server.to(senderSocketId).emit('message-status', {
        messageId: data.messageId,
        status: 'seen',
        seenAt: new Date(),
        seenBy: client.data.userId,
      });
    }
  }

  @SubscribeMessage('check-seen-status')
  async handleCheckSeenStatus(
      @MessageBody() data: { messageIds: string[] },
      @ConnectedSocket() client: Socket
  ) {
    const statuses = await this.messageService.getSeenStatuses(data.messageIds);

    this.server.to(client.id).emit('message-status-batch', statuses);
  }


}