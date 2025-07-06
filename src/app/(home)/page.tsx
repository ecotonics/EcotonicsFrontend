import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, IndianRupeeIcon } from "lucide-react";

function Homepage() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
            <Card>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <span className="bg-blue-400 w-14 h-14 flex items-center justify-center rounded-full">
                            <IndianRupeeIcon size={28} strokeWidth={3} />
                        </span>
                        <div>
                            <h4 className="text-xl ">
                                This Month&apos;s Income
                            </h4>
                            <p className="text-3xl font-bold">0</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <span className="bg-blue-400 w-14 h-14 flex items-center justify-center rounded-full">
                            <IndianRupeeIcon size={28} strokeWidth={3} />
                        </span>
                        <div>
                            <h4 className="text-xl ">
                                This Month&apos;s Expense
                            </h4>
                            <p className="text-3xl font-bold">0</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <span className="bg-blue-400 w-14 h-14 flex items-center justify-center rounded-full">
                            <Check size={30} strokeWidth={3} />
                        </span>
                        <div>
                            <h4 className="text-xl ">Completed Todos</h4>
                            <p className="text-3xl font-bold">0</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Homepage;
