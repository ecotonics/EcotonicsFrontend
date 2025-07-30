"use client";

import { Biohazard, CheckCheck, EqualNot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import Header from "@/components/Header";
import { useListStaffs } from "@/hooks/apis/Staffs/staffs-list";

export default function Staffs() {
    const { data, isLoading } = useListStaffs();

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
                                <h4 className="text-xl ">Total Staffs</h4>
                                {isLoading ? (
                                    <Skeleton className="h-8 w-8" />
                                ) : (
                                    <p className="text-3xl font-bold">
                                        {data?.data?.total_staffs}
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
                                <h4 className="text-xl ">Active Staffs</h4>
                                {isLoading ? (
                                    <Skeleton className="h-8 w-12" />
                                ) : (
                                    <p className="text-3xl font-bold">
                                        {" "}
                                        {data?.data?.active_staffs}
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
                                    Inactive Staffs
                                </h4>
                                {isLoading ? (
                                    <Skeleton className="h-8 w-8" />
                                ) : (
                                    <p className="text-3xl font-bold">
                                        {" "}
                                        {data?.data?.inactive_staffs}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="py-10">
                <Header
                    title="Staffs List"
                    buttonText="Add New Staff"
                    buttonRoute="/staffs/create"
                />

                {isLoading ? (
                    <TableSkeleton columns={columns.length} rows={5} />
                ) : (
                    <DataTable
                        columns={columns}
                        data={data?.data?.staffs || []}
                    />
                )}
            </div>
        </>
    );
}