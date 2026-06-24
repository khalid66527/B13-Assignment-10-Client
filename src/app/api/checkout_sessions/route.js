import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { PLAN_PRICE_ID, stripe } from '@/lib/stripe';
import { getUserSession } from '@/lib/core/session';

// import { stripe } from '../../../lib/stripe'

export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const formData = await request.formData()
    const checkoutType = formData.get('checkout_type')
    const user = await getUserSession()

    if (checkoutType === 'purchase') {
      const artId = formData.get('art_id')
      const title = formData.get('title')
      const image = formData.get('image')
      const description = formData.get('description')
      const artistEmail = formData.get('artistEmail')
      const artistName = formData.get('artistName')
      const companyName = formData.get('companyName')
      const price = formData.get('price')

      // Create Checkout Sessions for one-time artwork purchases with dynamic details.
      const session = await stripe.checkout.sessions.create({
        customer_email: user?.email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: title || "Artwork Painting",
                images: image ? [image] : [],
                description: description || "Premium digital artwork.",
              },
              unit_amount: Math.round(Number(price || 0) * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        metadata: {
          checkout_type: 'purchase',
          artId,
          userName: user?.name || "Unknown Buyer",
          userEmail: user?.email || "No Email",
          userId: user?.id || "No Id",
          artistEmail,
          artistName,
          companyName,
          price,
        },
        success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shop/${artId}/buyNow`,
      });

      return NextResponse.redirect(session.url, 303)
    } else {
      const planId = formData.get('plan_id')
      const priceId = PLAN_PRICE_ID[planId]

      // Create Checkout Sessions from body params for subscriptions.
      const session = await stripe.checkout.sessions.create({
        customer_email: user?.email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        metadata: { planId },
        success_url: `${origin}/plans/success?session_id={CHECKOUT_SESSION_ID}`,
      });

      return NextResponse.redirect(session.url, 303)
    }
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}