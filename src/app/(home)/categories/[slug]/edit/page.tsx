"use client";

import React from "react";
import Category from "../../_components/Category";
import { useParams } from "next/navigation";

function EditCategory() {
    const params = useParams();
    const slug = params.slug ?? "";

    return (
        <>
            <Category slug={slug} />
        </>
    );
}

export default EditCategory;
