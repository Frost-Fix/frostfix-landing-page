import { NextPage } from "next";
import Head from "next/head";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { FormControl, FormLabel, Text, useToast } from "@chakra-ui/react";
import AuthLayout from "@/components/auth/AuthLayout";
import PrimaryButton from "@/components/core/Buttons/PrimaryButton";
import PasswordInput from "@/components/core/Inputs/PasswordInput";
import { apiPost, ApiError } from "@/lib/api";

const ResetPassword: NextPage = () => {
    const router = useRouter();
    const toast = useToast();
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const resetToken =
        typeof router.query.resetToken === "string"
            ? router.query.resetToken
            : "";

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!resetToken) {
            toast({
                title: "This reset link is invalid or expired.",
                status: "error",
            });
            return;
        }

        setIsLoading(true);

        try {
            await apiPost(
                `/auth/homeowners/reset-password?resetToken=${encodeURIComponent(
                    resetToken
                )}`,
                { newPassword }
            );
            toast({
                title: "Password reset! You can now log in.",
                status: "success",
            });
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
                <title>Set a New Password</title>
            </Head>
            <AuthLayout
                title="Set a new password"
                subtitle="Choose something you haven't used before"
            >
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <FormControl mb={2} isRequired>
                        <FormLabel>New password</FormLabel>
                        <PasswordInput
                            size="lg"
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                        Reset password
                    </PrimaryButton>
                </form>
            </AuthLayout>
        </>
    );
};

export default ResetPassword;
