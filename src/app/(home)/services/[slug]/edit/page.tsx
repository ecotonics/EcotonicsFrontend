"use client";

import React from "react";
import Service from "../../_components/Service";
import { useParams } from "next/navigation";

function EditService() {
    const params = useParams();
    const slug = params.slug ?? "";

    return (
        <>
            <Service slug={slug} />
        </>
    );
}

export default EditService;
