import { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import {
    FormControl,
    FormLabel,
    Input,
    Link,
    Text,
    useToast,
} from "@chakra-ui/react";
import AuthLayout from "@/components/auth/AuthLayout";
import PrimaryButton from "@/components/core/Buttons/PrimaryButton";
import PasswordInput from "@/components/core/Inputs/PasswordInput";
import { apiPost, ApiError } from "@/lib/api";
import { validateEmail, validateName } from "@/utils/validation";

const Signup: NextPage = () => {
    const router = useRouter();
    const toast = useToast();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const nameCheck = validateName(fullName);
        const emailCheck = validateEmail(email);

        if (!nameCheck.isValid) {
            toast({ title: nameCheck.errorMessage, status: "error" });
            return;
        }

        if (!emailCheck.isValid) {
            toast({ title: emailCheck.errorMessage, status: "error" });
            return;
        }

        setIsLoading(true);

        try {
            await apiPost("/auth/homeowners/register", {
                fullName,
                email,
                password,
            });
            toast({
                title: "Account created! Check your email for a verification code.",
                status: "success",
            });
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
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
                <title>Create Your FrostFix Account</title>
            </Head>
            <AuthLayout
                title="Create your account"
                subtitle="Book seasonal home services in minutes"
                footer={
                    <Text fontSize="sm" color="gray.500">
                        Already have an account?{" "}
                        <NextLink href="/login" passHref>
                            <Link color="var(--season-primary)" fontWeight={600}>
                                Log in
                            </Link>
                        </NextLink>
                    </Text>
                }
            >
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <FormControl mb={4} isRequired>
                        <FormLabel>Full name</FormLabel>
                        <Input
                            size="lg"
                            autoComplete="name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Jane Doe"
                        />
                    </FormControl>
                    <FormControl mb={4} isRequired>
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
                    <FormControl mb={2} isRequired>
                        <FormLabel>Password</FormLabel>
                        <PasswordInput
                            size="lg"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 8 characters"
                        />
                    </FormControl>
                    <Text fontSize="xs" color="gray.400" mb={6}>
                        Use 8+ characters with an uppercase letter, a number,
                        and a symbol.
                    </Text>
                    <PrimaryButton
                        type="submit"
                        w="100%"
                        size="lg"
                        isLoading={isLoading}
                    >
                        Sign up
                    </PrimaryButton>
                </form>
            </AuthLayout>
        </>
    );
};

export default Signup;
