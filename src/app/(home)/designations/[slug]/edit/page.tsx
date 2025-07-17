"use client";

import React from "react";
import Designation from "../../_components/Designation";
import { useParams } from "next/navigation";

function EditDesignation() {
    const params = useParams();
    const slug = params.slug ?? "";

    return (
        <>
            <Designation slug={slug} />
        </>
    );
}

export default EditDesignation;