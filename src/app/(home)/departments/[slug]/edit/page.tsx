"use client";

import React from "react";
import Department from "../../_components/Department";
import { useParams } from "next/navigation";

function EditDepartment() {
    const params = useParams();
    const slug = params.slug ?? "";

    return (
        <>
            <Department slug={slug} />
        </>
    );
}

export default EditDepartment;