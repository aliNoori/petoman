import {Controller, Get, Patch, Body, Req} from '@nestjs/common';
import { PerformanceSettingDto} from "./dto/update-performance-setting.dto";
import {DanimPerformanceSettingService} from "./performance-setting.service";

@Controller({ path: 'danim-settings/performance'})
export class DanimPerformanceSettingController {
    constructor(private readonly seoService: DanimPerformanceSettingService) {}

    @Get()
    getSettings() {
        return this.seoService.getAllAsObject();
    }

    @Patch()
    updateSettings(@Body() dto: PerformanceSettingDto) {

        return this.seoService.updateMany(dto.settings);


    }
}