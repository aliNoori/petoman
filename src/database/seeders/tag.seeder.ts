// file: seeders/tag.seeder.ts
import { AppDataSource } from '../data-source';
import { Tag } from '../../shared/tag/tag.entity';
import slugify from 'slugify';

async function seedTags() {
    await AppDataSource.initialize();
    const tagRepo = AppDataSource.getRepository(Tag);

    const tags = [
        { name: 'حیوانات', description: 'مطالب مرتبط با حیوانات' },
        { name: 'نجات', description: 'موارد مربوط به نجات اضطراری' },
        { name: 'حمایت مالی', description: 'کمک‌های مالی و اسپانسرینگ' },
        { name: 'رویدادها', description: 'اخبار و رویدادهای مرتبط' },
        { name: 'داوطلبی', description: 'فعالیت‌های داوطلبانه' },
        { name: 'آموزش', description: 'آگاهی و آموزش عمومی' },
    ];

    for (const t of tags) {
        const slug = slugify(t.name, { lower: true, strict: true });
        const exist = await tagRepo.findOne({ where: { slug } });
        if (!exist) {
            await tagRepo.save(
                tagRepo.create({
                    name: t.name,
                    slug,
                    description: t.description,
                    count: 0,
                    lastUsed: 'هرگز',
                }),
            );
        }
    }

    console.log('✅ Tags seeded');
    await AppDataSource.destroy();
}

seedTags().catch(console.error);
