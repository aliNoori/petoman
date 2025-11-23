import {Controller, Get, Param} from '@nestjs/common';
import { AppService } from './app.service';
import {MessageService} from "./socket/message/message.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly messageService:MessageService) {}


  @Get('/health')
  check() {
    return { status: 'ok' };
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/messages/pending/:userId')
  getPendingMessages(@Param('userId') id: string) {
    return this.messageService.getPendingMessages(id);
  }

}
