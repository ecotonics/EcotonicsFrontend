"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useDesignation } from "@/hooks/apis/Designations/designation";

const DesignationDetails = () => {
    const params = useParams();
    const slug = typeof params.slug === "string" ? params.slug : "";
    const { data, isLoading, error } = useDesignation({ slug });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data) return <p>No Designation found.</p>;

    return (
        <div>
            <h1>{data.data.name}</h1>
            <p>{data.data.description}</p>
            {/* Add more designation details as needed */}
        </div>
    )
}

export default DesignationDetails