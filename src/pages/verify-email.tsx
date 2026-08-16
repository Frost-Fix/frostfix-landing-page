import { NextPage } from "next";
import Head from "next/head";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { Button, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import AuthLayout from "@/components/auth/AuthLayout";
import { apiGet, ApiError } from "@/lib/api";

const VerifyEmail: NextPage = () => {
    const router = useRouter();
    const toast = useToast();
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const email =
        typeof router.query.email === "string" ? router.query.email : "";

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!otp) {
            toast({ title: "Enter the code from your email", status: "error" });
            return;
        }

        setIsLoading(true);

        try {
            await apiGet(
                `/auth/homeowners/verify-email?otp=${encodeURIComponent(otp)}`
            );
            toast({ title: "Email verified! You can now log in.", status: "success" });
            router.push("/login");
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
                <title>Verify Your Email</title>
            </Head>
            <AuthLayout
                title="Verify your email"
                subtitle={
                    email
                        ? `Enter the 6-digit code we sent to ${email}`
                        : "Enter the 6-digit code we emailed you"
                }
            >
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <FormControl mb={6} isRequired>
                        <FormLabel>Verification code</FormLabel>
                        <Input
                            size="lg"
                            textAlign="center"
                            letterSpacing="0.5em"
                            fontSize="xl"
                            maxLength={6}
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder="123456"
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        w="100%"
                        size="lg"
                        bg="var(--season-primary)"
                        color="white"
                        isLoading={isLoading}
                        _hover={{ opacity: 0.9 }}
                    >
                        Verify
                    </Button>
                </form>
                <Text fontSize="xs" color="gray.400" pt={2} textAlign="center">
                    Didn&apos;t get a code? Check your spam folder, or sign up
                    again to request a new one.
                </Text>
            </AuthLayout>
        </>
    );
};

export default VerifyEmail;
