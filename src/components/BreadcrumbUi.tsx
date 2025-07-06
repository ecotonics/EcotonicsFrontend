import React from "react";

import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

function BreadcrumbUi() {
    const pathname = usePathname();

    const pathSegments = pathname
        .split("/")
        .filter((segment) => segment !== "");

    const breadcrumbItems = pathSegments.map((segment, index) => {
        const path = "/" + pathSegments.slice(0, index + 1).join("/");
        const label =
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, " ");
        const isLast = index === pathSegments.length - 1;

        return {
            path,
            label,
            isLast,
        };
    });

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {breadcrumbItems.map((item) => (
                    <React.Fragment key={item.path}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {item.isLast ? (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={item.path}>{item.label}</Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default BreadcrumbUi;
