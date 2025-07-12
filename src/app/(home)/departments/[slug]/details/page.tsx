"use client";

import React from "react";
import { useParams } from "next/navigation";

function DepartmentDetails() {
    const params = useParams();
    const slug = params.slug ?? "";

    return (
        <>
            <h1>Something Here</h1>
        </>
    );
}

export default DepartmentDetails;