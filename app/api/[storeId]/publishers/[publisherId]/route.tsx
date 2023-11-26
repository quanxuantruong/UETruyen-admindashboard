import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
    req: Request,
    { params }: { params: { publisherId: string } }
) {
    try {
        if (!params.publisherId) {
            return new NextResponse("Publisher id is required", { status: 400 });
        }

        const publisher = await prismadb.publisher.findUnique({
            where: {
                id: params.publisherId
            }
        });

        return NextResponse.json(publisher);
    } catch (error) {
        console.log('[PUBLISHER_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { publisherId: string, storeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!params.publisherId) {
            return new NextResponse("Publisher id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        const publisher = await prismadb.publisher.delete({
            where: {
                id: params.publisherId
            }
        });

        return NextResponse.json(publisher);
    } catch (error) {
        console.log('[PUBLISHER_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};


export async function PATCH(
    req: Request,
    { params }: { params: { publisherId: string, storeId: string } }
) {
    try {
        const { userId } = auth();

        const body = await req.json();

        const { name } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!params.publisherId) {
            return new NextResponse("Publisher id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        const publisher = await prismadb.publisher.update({
            where: {
                id: params.publisherId
            },
            data: {
                name,
            }
        });

        return NextResponse.json(publisher);
    } catch (error) {
        console.log('[PUBLISHER_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};