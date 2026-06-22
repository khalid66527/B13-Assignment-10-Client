import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


export const PLAN_PRICE_ID ={
    buynower_Pro:'price_1TlDooL2OIqosKhg2vVQCFkL',
    buynower_Premium:'price_1TlEIVL2OIqosKhgZnDJInrm'
}