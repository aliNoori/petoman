import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import { PaymentGateway } from './payment-gateway.interface'

@Injectable()
export class ZarinpalGateway implements PaymentGateway {
    readonly name = 'zarinpal'
    private readonly logger = new Logger(ZarinpalGateway.name)

    private readonly merchantId: string
    private readonly callbackUrl:string
    private readonly sandbox: boolean

    constructor() {

        this.merchantId = process.env.ZARINPAL_MERCHANT_ID!
        this.sandbox = process.env.ZARINPAL_SANDBOX === 'true'
        this.callbackUrl=process.env.PAYMENT_CALLBACK_URL!
    }

    private getRequestUrl() {
        return this.sandbox
            ? 'https://sandbox.zarinpal.com/pg/v4/payment/request.json'
            : 'https://payment.zarinpal.com/pg/v4/payment/request.json'
    }

    private getVerifyUrl() {
        return this.sandbox
            ? 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json'
            : 'https://payment.zarinpal.com/pg/v4/payment/verify.json'
    }

    private getRedirectUrl(authority: string) {
        return this.sandbox
            ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
            : `https://payment.zarinpal.com/pg/StartPay/${authority}`
    }

    async pay(amount: number, callbackUrl: string, meta: any = {}) {

        const response = await axios.post(this.getRequestUrl(), {
            merchant_id: this.merchantId,
            amount: Math.floor(amount),
            callback_url: callbackUrl,
            description: meta.description ?? 'پرداخت سفارش',
            metadata: {
                email: meta.email,
                mobile: meta.mobile,
            },
        })

        const data = response.data

        if (data.data.code !== 100 || !data.data.authority) {
            throw new Error(`Zarinpal error: ${data.data.code}`)
        }

        return {
            authority: data.data.authority,
            redirectUrl: this.getRedirectUrl(data.data.authority),
        }
    }

    async verify(payload: {
        Authority: string
        Status: string
        Amount: number
    }) {
        if (!payload.Authority || payload.Status !== 'OK') {
            throw new Error('پرداخت لغو شد')
        }

        const response = await axios.post(this.getVerifyUrl(), {
            merchant_id: this.merchantId,
            authority: payload.Authority,
            amount: payload.Amount,
        })

        const data = response.data
        this.logger.log(data)

        if (data.data.code === 100) {
            return {
                refId: data.data.ref_id,
                cardPan: data.data.card_pan,
                fee: data.data.fee,
                feeType: data.data.fee_type,
                orderId: data.data.order_id,
            }
        }

        if (data.data.code === 101) {
            return {
                message: 'Already verified',
                refId: data.data.ref_id,
            }
        }

        throw new Error('پرداخت ناموفق')
    }

    shouldRedirect(): boolean {
        return true
    }
}