import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { PLAN_PRICE_ID, stripe } from '@/lib/stripe';
import { getUserSession } from '@/lib/core/session';

// import { stripe } from '../../../lib/stripe'

export async function POST(request) {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const origin = headersList.get('origin') || `${protocol}://${host}`;

    const formData = await request.formData()
    const checkoutType = formData.get('checkout_type')
    const user = await getUserSession()

    if (checkoutType === 'cart') {
      const rawItems = formData.get('items');
      const items = rawItems ? JSON.parse(rawItems) : [];
      const shippingAddress = formData.get('shipping_address') || '';
      const shippingPhone = formData.get('shipping_phone') || '';
      const shippingName = formData.get('shipping_name') || '';
      const addressId = formData.get('address_id') || '';
      const discountPercent = Number(formData.get('discount_percent')) || 0;

      if (!items || items.length === 0) {
        return NextResponse.json({ error: "No items in cart" }, { status: 400 });
      }

      const line_items = items.map((item) => {
        const itemPrice = Number(item.price) || 0;
        const discountedPrice = discountPercent > 0 
          ? Math.max(0, itemPrice * (1 - discountPercent / 100))
          : itemPrice;

        const isValidImg = item.image && (String(item.image).startsWith('http://') || String(item.image).startsWith('https://'));

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: String(item.title || "Fine Artwork").slice(0, 200),
              images: isValidImg ? [item.image] : [],
              description: `By ${item.artistName || "Artist"} • ${item.category || "Fine Art"}`.slice(0, 300),
            },
            unit_amount: Math.max(50, Math.round(Number(discountedPrice || 1) * 100)),
          },
          quantity: Math.max(1, Number(item.quantity) || 1),
        };
      });

      const itemsSummary = items.map(i => ({
        id: String(i.artworkId || i.artId || i.id || i._id),
        title: i.title || "Art",
        price: Number(i.price) || 0,
        qty: Number(i.quantity) || 1,
        artistEmail: i.artistEmail || "",
        artistName: i.artistName || "",
        companyName: i.companyName || "",
        companyId: i.companyId || "",
        category: i.category || "",
        image: i.image || ""
      }));

      const session = await stripe.checkout.sessions.create({
        customer_email: user?.email ? user.email : undefined,
        line_items,
        mode: 'payment',
        metadata: {
          checkout_type: 'cart',
          userName: user?.name || "Unknown Buyer",
          userEmail: user?.email || "No Email",
          userId: user?.id || "No Id",
          addressId: String(addressId || "").slice(0, 50),
          shippingName: String(shippingName || "").slice(0, 100),
          shippingPhone: String(shippingPhone || "").slice(0, 50),
          shippingAddress: String(shippingAddress || "").slice(0, 200),
          itemsCount: String(items.length),
          cartData: JSON.stringify(itemsSummary).slice(0, 490),
        },
        success_url: `${origin}/shop/cart/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/dashboard/user/cart`,
      });

      return NextResponse.redirect(session.url, 303);
    } else if (checkoutType === 'purchase') {
      const artId = formData.get('art_id')
      const title = formData.get('title')
      const image = formData.get('image')
      const description = formData.get('description')
      const artistEmail = formData.get('artistEmail')
      const artistName = formData.get('artistName')
      const companyName = formData.get('companyName')
      const price = formData.get('price')
      const shippingAddress = formData.get('shipping_address') || ''
      const shippingPhone = formData.get('shipping_phone') || ''
      const shippingName = formData.get('shipping_name') || ''
      const addressId = formData.get('address_id') || ''

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
          addressId,
          shippingName,
          shippingPhone,
          shippingAddress,
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
        metadata: {
          checkout_type: 'subscription',
          planId,
          userEmail: user?.email || '',
          userId: user?.id || '',
        },
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