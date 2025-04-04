import { Request, Response } from "express";
import { STRIPE_SECRET } from "../constants/env";
import Stripe from "stripe";
const stripe = require("stripe")(STRIPE_SECRET);

export const createStripeHosted = async (req: Request, res: Response) => {
    const { line_items, customer } = req.body; 

    if (!customer?.email) {
        res.status(400).json({ error: "Customer email is required" });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: customer.email,
            shipping_address_collection: {
                allowed_countries: ["SE"],
            },
            metadata: {
                customer_id: customer.id.toString(),
                street_address: customer.street_address,
                postal_code: customer.postal_code, 
                city: customer.city,
                country: customer.country,
            },
            line_items: line_items.map((item: any) => ({
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: item.price_data.product_data.name,
                        description: item.price_data.product_data.description,
                        images: item.price_data.product_data.images || [],
                        metadata: {
                            product_id: item.price_data.product_data.id,
                        },
                    },
                    unit_amount: item.price_data.unit_amount,
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5173/cart",
        });
        res.json({ 
            checkout_url: session.url,
            sessionId: session.id, 
        });
    } catch (error) {
        console.error("Error creating checkout session: ", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
        res.status(500).json({ 
            error: "Could not create Stripe checkout session", 
            details: errorMessage 
        });
    }
};

export const getStripeSession = async (req: Request, res: Response) => {
    
    const { sessionId } = req.params;
    try {
        if (!sessionId) {
            res.status(400).json({ error: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
            limit: 100,
        });

        const products = await Promise.all(
            lineItems.data.map(async (item: Stripe.LineItem) => {
                if (!item.price || !item.price.product) {
                    console.warn("Skipping line item with null price or product");
                    return null; // Skip invalid items
                }

                const product = await stripe.products.retrieve(item.price.product as string);
                console.log("Product info for line item:", product);
                return product;
            })
        );

        res.json({
            session,
            lineItems: lineItems.data,
            products: products.filter(Boolean),
        }); 
    } catch (error: any) {
        console.error("Error fetching Stripe session:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        res.status(500).json({ error: "Failed to retrieve Stripe session", details: errorMessage });
    }
};