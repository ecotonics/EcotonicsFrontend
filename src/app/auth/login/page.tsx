"use client";
/* eslint-disable */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import useCreateMutation from "@/hooks/useCreateMutation";
import useAuthStore from "@/context/zustand-store";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});

export default function LoginForm() {
    const { login } = useAuthStore();
    const { SIGN_IN } = API_ENDPOINTS;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const { mutate, isPending } = useCreateMutation({
        method: "post",
        endpoint: SIGN_IN,
        submitData: {},
        redirectPath: "/",
        isToast: true,
        handleSuccess: (response: any) => {
            if (response.access && response.refresh) {
                const username = form.getValues("username");
                login({
                    username,
                    access_token: response.access,
                    refresh_token: response.refresh,
                });
            }
        },
        handleError: (error: any) => {
            if (error.form_errors) {
                Object.keys(error.form_errors).forEach((key) => {
                    form.setError(key as any, {
                        type: "manual",
                        message: error.form_errors[key],
                    });
                });
            }
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate({ extraSubmitData: values });
    }

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-black p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">
                        Welcome back
                    </CardTitle>
                    <CardDescription>
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isPending}
                            >
                                {isPending ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
