import prismadb from "@/lib/prismadb";

import { PublisherForm } from "./components/publisher-form";

const PublisherPage = async ({
    params
}: {
    params: { publisherId: string }
}) => {
    const publisher = await prismadb.publisher.findUnique({
        where: {
            id: params.publisherId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <PublisherForm initialData={publisher} />
            </div>
        </div>
    );
}

export default PublisherPage;