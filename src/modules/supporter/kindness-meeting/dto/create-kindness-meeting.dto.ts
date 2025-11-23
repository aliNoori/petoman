import {
    IsString,
    IsEnum,
    IsOptional,
    IsNotEmpty,
    IsBooleanString,
    IsDateString,
    IsNumberString,
    MaxLength, Min, ValidateIf,
} from 'class-validator'
import { KindnessType, KindnessStatus, TimerType } from '../kindness-meeting.entity'

export class CreateKindnessMeetingDto {
    @IsEnum(KindnessType)
    type: KindnessType

    @IsOptional()
    @IsString()
    image?: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    // مالی
    @ValidateIf((o) => o.type === KindnessType.FINANCIAL)
    @IsNumberString()
    //@Min(1000000)
    goal: string

    @IsOptional()
    @IsNumberString()
    current?: string

    @ValidateIf((o) => o.type === KindnessType.FINANCIAL)
    @IsDateString()
    startDate?: string

    @IsOptional()
    @IsString()
    startTime?: string

    @ValidateIf((o) => o.type === KindnessType.FINANCIAL)
    @IsDateString()
    endDate?: string

    @IsOptional()
    @IsString()
    endTime?: string

    // داوطلبانه
    @ValidateIf((o) => o.type === KindnessType.VOLUNTEER)
    @IsString()
    @IsNotEmpty()
    location: string

    @ValidateIf((o) => o.type === KindnessType.VOLUNTEER)
    @IsDateString()
    eventDate: string

    @IsOptional()
    @IsString()
    eventTime?: string

    // عمومی
    @IsString()
    @MaxLength(100)
    manager: string

    @IsOptional()
    @IsEnum(KindnessStatus)
    status?: KindnessStatus

    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsOptional()
    @IsBooleanString()
    showOnHomepage?: string

    // تایمر
    @IsOptional()
    @IsBooleanString()
    showTimer?: string

    @ValidateIf((o) => o.showTimer === 'true')
    @IsEnum(TimerType)
    timerType: TimerType

    @IsOptional()
    @IsBooleanString()
    timerAlert?: string

    @ValidateIf((o) => o.showTimer === 'true' && o.timerAlert === 'true')
    @IsNumberString()
    alertDays: string
}