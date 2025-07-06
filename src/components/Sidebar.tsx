"use client";
/* eslint-disable */

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    Calendar,
    ChevronUp,
    Home,
    Inbox,
    LogOut,
    Settings,
    User,
    Users,
    DoorOpen,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarSeparator,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import logo from "../../public/assets/images/logo.svg";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible";
import useAuthStore from "@/context/zustand-store";

function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const items = [
        {
            title: "Dashboard",
            url: "/",
            icon: Home,
        },
        {
            title: "Services",
            url: "#",
            icon: Inbox,
            children: [
                {
                    title: "Categories",
                    url: "/categories",
                    icon: Inbox,
                },
                {
                    title: "Service List",
                    url: "/services",
                    icon: Inbox,
                },
            ],
        },
        {
            title: "Workforce",
            url: "/workforce",
            icon: Calendar,
            badge: "14",
        },
        {
            title: "Masters",
            url: "/masters",
            icon: Settings,
        },
    ];

    const isActiveItem = (item: any) => {
        if (item.url === "/" && pathname === "/") return true;
        if (
            item.url !== "/" &&
            item.url !== "#" &&
            pathname.startsWith(item.url)
        )
            return true;
        if (item.children) {
            return item.children.some((child: any) => pathname === child.url);
        }
        return false;
    };

    const isActiveChild = (childUrl: any) => {
        return pathname === childUrl;
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/">
                                <Image
                                    src={logo}
                                    alt="logo"
                                    width={20}
                                    height={20}
                                />
                                <span>Ecotonics</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menus</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) =>
                                item.children ? (
                                    <Collapsible
                                        key={item.title}
                                        className="group/collapsible"
                                        defaultOpen={isActiveItem(item)}
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    isActive={isActiveItem(
                                                        item
                                                    )}
                                                >
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                    <ChevronUp className="ml-auto transition-transform group-data-[state=closed]/collapsible:rotate-180" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.children.map(
                                                        (child) => (
                                                            <SidebarMenuItem
                                                                key={
                                                                    child.title
                                                                }
                                                            >
                                                                <SidebarMenuButton
                                                                    asChild
                                                                    isActive={isActiveChild(
                                                                        child.url
                                                                    )}
                                                                >
                                                                    <Link
                                                                        href={
                                                                            child.url
                                                                        }
                                                                    >
                                                                        <child.icon />
                                                                        <span>
                                                                            {
                                                                                child.title
                                                                            }
                                                                        </span>
                                                                    </Link>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                        )
                                                    )}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActiveItem(item)}
                                        >
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        {item.badge && (
                                            <SidebarMenuBadge>
                                                {item.badge}
                                            </SidebarMenuBadge>
                                        )}
                                    </SidebarMenuItem>
                                )
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User /> {user?.username || "User"}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <User /> Account
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings /> Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={handleLogout}
                                >
                                    <LogOut /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;
