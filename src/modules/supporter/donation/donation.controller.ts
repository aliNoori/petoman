import {Controller, Post, Body, Get, Param, Patch, Delete} from '@nestjs/common';
import { DonationService } from './donation.service';
import {CreateDonationDto} from "./dto/create-donation.dto";


@Controller({path: 'donations', version: '1'})
export class DonationController {
    constructor(private readonly donationService: DonationService) {}

    @Post()
    create(@Body() body) {
        return this.donationService.create(body);
    }
    @Patch(':id')
    update(@Param('id') id: string, @Body() body: Partial<CreateDonationDto>) {
        return this.donationService.update(id, body)
    }

    @Get()
    findAll() {
        return this.donationService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.donationService.findOne(id);
    }
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.donationService.remove(id)
    }
}