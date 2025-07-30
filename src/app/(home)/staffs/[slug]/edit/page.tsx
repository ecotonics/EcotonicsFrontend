"use client";

import React from "react";
import Staff from "../../_components/Staff";
import { useParams } from "next/navigation";

function EditStaff() {
    const params = useParams();
    const slug = params.slug ?? "";

    return (
        <>
            <Staff slug={slug} />
        </>
    );
}

export default EditStaff;
