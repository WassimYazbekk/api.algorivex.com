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
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, Navigate } from "react-router-dom";
import http from "@/axios-client";
import { useAuthContext } from "@/contexts/auth-context";

const formSchema = z.object({
    email: z.string().email({
        message: "Invalid email address",
    }),
    password: z.string(),
});

const Login = () => {
    const { setCurrentUser, setAuthToken } = useAuthContext();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await http.post("auth/login", values);
            const data = await response.data;

            if (response.status === 200) {
                setCurrentUser(data.user);
                setAuthToken(data.token);
                return <Navigate to={"/dashboard"} />;
            }
        } catch (error: any) {
            if (error.response) {
                form.resetField("password");
                form.setError(
                    "password",
                    {
                        type: "server-error",
                        message: error.response.data.error,
                    },
                    { shouldFocus: true },
                );
            }
            console.error(error);
        }
    }

    return (
        <Card className="max-w-lg w-full self-center">
            <CardHeader className="items-center">
                <CardTitle className="text-4xl">Login</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
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
                        <div className="flex justify-between">
                            <Button type="submit">Submit</Button>
                            <p className="flex items-center">
                                Not a user?
                                <Link
                                    to="/register"
                                    className="text-blue-500 ml-1"
                                >
                                    Register now
                                </Link>
                            </p>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <Link to="/register">
                    <p className="text-blue-500">Forgot your password?</p>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default Login;
