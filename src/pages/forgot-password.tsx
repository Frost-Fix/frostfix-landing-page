import { NextPage } from "next";
import Head from "next/head";
import { useState, FormEvent } from "react";
import {
    FormControl,
    FormLabel,
    Input,
    Text,
    useToast,
} from "@chakra-ui/react";
import AuthLayout from "@/components/auth/AuthLayout";
import PrimaryButton from "@/components/core/Buttons/PrimaryButton";
import { apiPost, ApiError } from "@/lib/api";

const ForgotPassword: NextPage = () => {
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await apiPost("/auth/homeowners/request-password-reset", {
                email,
            });
            setSent(true);
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
                <title>Reset Your Password</title>
            </Head>
            <AuthLayout
                title="Forgot your password?"
                subtitle="We'll email you a reset link"
            >
                {sent ? (
                    <Text textAlign="center" color="gray.600">
                        If an account exists for {email}, a reset link is on
                        its way.
                    </Text>
                ) : (
                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <FormControl mb={6} isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                size="lg"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </FormControl>
                        <PrimaryButton
                            type="submit"
                            w="100%"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Send reset link
                        </PrimaryButton>
                    </form>
                )}
            </AuthLayout>
        </>
    );
};

export default ForgotPassword;
