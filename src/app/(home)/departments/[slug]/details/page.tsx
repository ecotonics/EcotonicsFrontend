"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useDepartment } from "@/hooks/apis/Departments/department";

function DepartmentDetails() {
    const params = useParams();
    const slug = typeof params.slug === "string" ? params.slug : "";
    const { data, isLoading, error } = useDepartment({ slug });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data) return <p>No department found.</p>;

    return (
        <div>
            <h1>{data.data.name}</h1>
            <p>{data.data.info}</p>
        </div>
    );
}

export default DepartmentDetails;