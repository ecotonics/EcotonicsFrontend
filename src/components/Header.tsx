"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface HeaderProps {
    title: string;
    buttonText?: string;
    buttonRoute?: string;
    onButtonClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    title,
    buttonText,
    buttonRoute,
    onButtonClick,
}) => {
    const router = useRouter();

    const handleClick = () => {
        if (onButtonClick) {
            onButtonClick();
        } else if (buttonRoute) {
            router.push(buttonRoute);
        }
    };

    return (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            {buttonText && <Button onClick={handleClick}>{buttonText}</Button>}
        </div>
    );
};

export default Header;
