import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { AuthorColumn } from "./components/columns"
import { AuthorsClient } from "./components/client";

const AuthorsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const authors = await prismadb.author.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedAuthors: AuthorColumn[] = authors.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <AuthorsClient data={formattedAuthors} />
            </div>
        </div>
    );
};

export default AuthorsPage;