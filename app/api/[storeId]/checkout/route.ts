import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    const { cartItems } = await req.json();

    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: cartItems.map((product: any) => product.id),
            }
        }
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product) => {
        const orderItem = cartItems.find((item: any) => item.id === product.id)
        line_items.push({
            quantity: orderItem.orderQuantity,
            price_data: {
                currency: 'VND',
                product_data: {
                    name: product.name,
                },
                unit_amount: product.price.toNumber() * 1
            }
        });
    });

    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId,
            isPaid: false,
            orderItems: {
                create: products.map((item: any) => {
                    const cartItem = cartItems.find((orderItem: any) => item.id === orderItem.id);
                    return {
                        product: {
                            connect: {
                                id: item.id,
                            }
                        },
                        orderQuantity: cartItem.orderQuantity,
                    }
                })
            }
        }
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        billing_address_collection: 'required',
        phone_number_collection: {
            enabled: true,
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
        metadata: {
            orderId: order.id
        },
    });

    return NextResponse.json({ url: session.url }, {
        headers: corsHeaders
    });
};