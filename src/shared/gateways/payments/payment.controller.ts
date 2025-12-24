import {Controller, Post, Body, Query, Get, Res} from '@nestjs/common'
import { PaymentService } from './payment.service'
import { Response } from 'express'

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post('pay')
    async pay(
        @Body('amount') amount: number,
        @Body('meta') meta?: any,
        @Body('supporterInfo') supporterInfo?: any,
    ) {
        return this.paymentService.startPayment(process.env.GATEWAY_NAME??'zarinpal', amount, meta,supporterInfo)
    }
    @Get('callback')
    async callback(
        @Query('tx') txId: string,
        @Query() query: any,
        @Res() res: Response,
    ) {
        try {
            const result = await this.paymentService.verifyPayment(
                process.env.GATEWAY_NAME??'zarinpal',
                query,
                txId,
            )
            // ✅ redirect موفق
            if (result.success) {
                return res.redirect(
                    `${process.env.FRONTEND_SUCCESS_URL}?order=${result.orderId}&ref=${result.refId}`
                )
            }

            // ❌ redirect ناموفق
            return res.redirect(
                `${process.env.FRONTEND_FAILED_URL}?order=${result.orderId}`
            )

        } catch (e) {
            return res.redirect(
                `${process.env.FRONTEND_FAILED_URL}?error=verify_failed`
            )
        }
    }
}