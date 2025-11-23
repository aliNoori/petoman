import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {DanimPerformanceSetting} from "./performance-setting.entity";
@Injectable()
export class DanimPerformanceSettingService {
    constructor(
        @InjectRepository(DanimPerformanceSetting)
        private readonly seoRepo: Repository<DanimPerformanceSetting>,
    ) {}

    async set(key: string, value: Record<string, any>) {
        if (!key) throw new Error('Key is required');

        let setting = await this.seoRepo.findOne({ where: { key } });

        if (!setting) {
            setting = this.seoRepo.create({ key, value });
        } else {
            setting.value = value;
        }

        return this.seoRepo.save(setting);
    }

    async get(key: string) {
        const setting = await this.seoRepo.findOne({ where: { key } });
        return setting ? setting.value : null;
    }

    async getAllAsObject() {
        const settings = await this.seoRepo.find();
        return settings.reduce((obj, item) => {
            obj[item.key] = item.value;
            return obj;
        }, {} as Record<string, any>);
    }

    async updateMany(settings: { key: string; value: Record<string, any> }[]) {
        const tasks = settings.map(s => this.set(s.key, s.value));
        return Promise.all(tasks);
    }


}