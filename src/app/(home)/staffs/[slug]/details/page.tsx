"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useStaff } from "@/hooks/apis/Staffs/staff";

const StaffDetails = () => {
    const params = useParams();
    const slug = typeof params.slug === "string" ? params.slug : "";
    const { data, isLoading, error } = useStaff({ slug });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data) return <p>No Staff found.</p>;

    return (
        <div>
            <h1>{data.data.name}</h1>
            <p>{data.data.description}</p>
            {/* Add more Staff details as needed */}
        </div>
    )
}

export default StaffDetails