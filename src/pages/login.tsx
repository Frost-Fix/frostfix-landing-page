import { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Link,
    Text,
    useToast,
} from "@chakra-ui/react";
import AuthLayout from "@/components/auth/AuthLayout";
import { apiPost, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const Login: NextPage = () => {
    const router = useRouter();
    const toast = useToast();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await apiPost<{
                data: { homeowner: any; token: string };
            }>("/auth/homeowners/login", { email, password });

            login("homeowner", res.data.token, res.data.homeowner);

            const redirect =
                typeof router.query.redirect === "string"
                    ? router.query.redirect
                    : "/booking/new";
            router.push(redirect);
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : "Something went wrong.";
            toast({ title: message, status: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Log In to FrostFix</title>
            </Head>
            <AuthLayout
                title="Welcome back"
                subtitle="Log in to book or manage your services"
                footer={
                    <Text fontSize="sm" color="gray.500">
                        New to FrostFix?{" "}
                        <NextLink href="/signup" passHref>
                            <Link color="var(--season-primary)" fontWeight={600}>
                                Create an account
                            </Link>
                        </NextLink>
                    </Text>
                }
            >
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <FormControl mb={4} isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            size="lg"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </FormControl>
                    <FormControl mb={2} isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            size="lg"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your password"
                        />
                    </FormControl>
                    <NextLink href="/forgot-password" passHref>
                        <Link
                            fontSize="sm"
                            color="gray.500"
                            display="block"
                            textAlign="right"
                            mb={6}
                        >
                            Forgot password?
                        </Link>
                    </NextLink>
                    <Button
                        type="submit"
                        w="100%"
                        size="lg"
                        bg="var(--season-primary)"
                        color="white"
                        isLoading={isLoading}
                        _hover={{ opacity: 0.9 }}
                    >
                        Log in
                    </Button>
                </form>
            </AuthLayout>
        </>
    );
};

export default Login;
