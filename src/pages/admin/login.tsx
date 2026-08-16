import { NextPage } from "next";
import Head from "next/head";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import AuthLayout from "@/components/auth/AuthLayout";
import PrimaryButton from "@/components/core/Buttons/PrimaryButton";
import PasswordInput from "@/components/core/Inputs/PasswordInput";
import { apiPost, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const AdminLogin: NextPage = () => {
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
            const res = await apiPost<{ data: { admin: any; token: string } }>(
                "/auth/admin/login",
                { email, password }
            );

            login("admin", res.data.token, res.data.admin);

            const redirect =
                typeof router.query.redirect === "string"
                    ? router.query.redirect
                    : "/admin/dashboard";
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
                <title>Admin Login</title>
            </Head>
            <AuthLayout title="Admin Login" subtitle="FrostFix operations">
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <FormControl mb={4} isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            size="lg"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mb={6} isRequired>
                        <FormLabel>Password</FormLabel>
                        <PasswordInput
                            size="lg"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <PrimaryButton
                        type="submit"
                        w="100%"
                        size="lg"
                        isLoading={isLoading}
                    >
                        Log in
                    </PrimaryButton>
                </form>
            </AuthLayout>
        </>
    );
};

export default AdminLogin;
