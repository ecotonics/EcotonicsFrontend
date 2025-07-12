"use client";

import { Biohazard, CheckCheck, EqualNot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import Header from "@/components/Header";
import { useListDepartments } from "@/hooks/apis/Departments/departments-list";

export default function Departments() {
    const { data, isLoading } = useListDepartments();

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-3 gap-4">
                <Card>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <span className="bg-blue-400 w-14 h-14 flex items-center justify-center rounded-full">
                                <Biohazard size={32} strokeWidth={3} />
                            </span>
                            <div>
                                <h4 className="text-xl ">Total Departments</h4>
                                {isLoading ? (
                                    <Skeleton className="h-8 w-8" />
                                ) : (
                                    <p className="text-3xl font-bold">
                                        {data?.data?.total_departments}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <span className="bg-blue-400 w-14 h-14 flex items-center justify-center rounded-full">
                                <CheckCheck size={32} strokeWidth={3} />
                            </span>
                            <div>
                                <h4 className="text-xl ">Active Departments</h4>
                                {isLoading ? (
                                    <Skeleton className="h-8 w-12" />
                                ) : (
                                    <p className="text-3xl font-bold">
                                        {" "}
                                        {data?.data?.active_departments}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <span className="bg-blue-400 w-14 h-14 flex items-center justify-center rounded-full">
                                <EqualNot size={32} strokeWidth={3} />
                            </span>
                            <div>
                                <h4 className="text-xl ">
                                    Inactive Departments
                                </h4>
                                {isLoading ? (
                                    <Skeleton className="h-8 w-8" />
                                ) : (
                                    <p className="text-3xl font-bold">
                                        {" "}
                                        {data?.data?.inactive_departments}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="py-10">
                <Header
                    title="Departments List"
                    buttonText="Add New Department"
                    buttonRoute="/departments/create"
                />

                {isLoading ? (
                    <TableSkeleton columns={columns.length} rows={5} />
                ) : (
                    <DataTable
                        columns={columns}
                        data={data?.data?.departments || []}
                    />
                )}
            </div>
        </>
    );
}