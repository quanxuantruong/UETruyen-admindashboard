"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ProductColumn = {
    id: string
    name: string;
    price: string;
    category: string;
    author: string;
    publisher: string;
    createdAt: string;
    isFeatured: boolean;
    isArchived: boolean;
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "isArchived",
        header: "Archived",
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "author",
        header: "Author",
    },
    {
        accessorKey: "publisher",
        header: "Publisher",
        // cell: ({ row }) => (
        //     <div className="flex items-center gap-x-2">
        //         {row.original.color}
        //         <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.color }} />
        //     </div>
        // )
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
];