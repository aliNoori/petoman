import { Module } from '@nestjs/common';
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {User} from "./entities/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Supporter} from "../../modules/supporter/public-supporters/supporter.entity";
import {UserSetting} from "./entities/user-setting.entity";


@Module({
  imports: [TypeOrmModule.forFeature([User,Supporter,UserSetting])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
