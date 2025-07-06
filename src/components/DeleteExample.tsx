import React from "react";
import { useDeleteMutation } from "@/hooks/useDeleteMutation";

interface DeleteExampleProps {
    itemId: string;
    itemName: string;
}

export default function DeleteExample({
    itemId,
    itemName,
}: DeleteExampleProps) {
    const { deleteItem, isPending, isError, error } = useDeleteMutation({
        endpoint: `/api/items/${itemId}`, // Replace with your actual API endpoint
        invalidateQueries: ["items", "item-details"], // Queries to invalidate after deletion
        redirectPath: "/items", // Redirect after successful deletion
        onSuccess: (response) => {
            console.log("Item deleted successfully:", response);
        },
        onError: (error) => {
            console.error("Delete failed:", error);
        },
        isToast: true, // Show toast notifications
    });

    const handleDelete = () => {
        // You can pass additional data if needed
        const deleteData = {
            id: itemId,
            reason: "User requested deletion",
            // Add any other data your API expects
        };

        deleteItem(deleteData);
    };

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Delete {itemName}</h3>
            <p className="text-gray-600 mb-4">
                Are you sure you want to delete this item? This action cannot be
                undone.
            </p>

            <div className="flex gap-2">
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Deleting..." : "Delete Item"}
                </button>

                <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                    Cancel
                </button>
            </div>

            {isError && (
                <div className="mt-2 text-red-600 text-sm">
                    Error: {error?.message || "Something went wrong"}
                </div>
            )}
        </div>
    );
}
