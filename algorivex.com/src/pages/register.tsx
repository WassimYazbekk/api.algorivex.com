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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, Navigate } from "react-router-dom";
import http from "@/axios-client";
import { useAuthContext } from "@/contexts/auth-context";

const formSchema = z
    .object({
        name: z
            .string()
            .min(4, { message: "Username must be at least 4 characters." })
            .max(32, { message: "Username can be at most 32 characters." }),
        email: z.string().email({
            message: "Invalid email address",
        }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters." })
            .max(256, { message: "Password can be at most 256 characters." }),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ["password_confirmation"],
    });

const Register = () => {
    const { setAuthToken, setCurrentUser } = useAuthContext();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await http.post("auth/register", values);
            const data = await response.data;

            if (response.status === 200) {
                setCurrentUser(data.user);
                setAuthToken(data.token);
                return <Navigate to={"/dashboard"} />;
            }
        } catch (error: any) {
            if (error.response) {
                form.resetField("password");
                form.resetField("password_confirmation");
                Object.keys(error.response.data.errors).forEach((key) => {
                    //@ts-ignore-next-line
                    form.setError(key, {
                        type: "server-error",
                        message: error.response.data.errors[key][0],
                    });
                });
            }
            console.error(error);
        }
    }
    return (
        <Card className="max-w-lg w-full self-center">
            <CardHeader className="items-center">
                <CardTitle className="text-4xl">Register</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="you@example.com"
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
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password_confirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between">
                            <Button
                                disabled={form.formState.isLoading}
                                type="submit"
                            >
                                Submit
                            </Button>
                            <p className="flex items-center">
                                Already a user?
                                <Link
                                    to="/login"
                                    className="text-blue-500 ml-1"
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default Register;
