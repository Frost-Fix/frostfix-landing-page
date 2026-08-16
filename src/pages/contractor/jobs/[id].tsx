import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
    Box,
    Center,
    Spinner,
    VStack,
    HStack,
    Text,
    Heading,
    Button,
    Divider,
    useToast,
} from "@chakra-ui/react";
import { useRequireRole } from "@/lib/useRequireRole";
import { apiGet, apiPatch, ApiError } from "@/lib/api";
import { Booking, ContactInfo } from "@/types/booking";
import DashboardShell from "@/components/layout/DashboardShell";
import BookingStatusBadge from "@/components/booking/BookingStatusBadge";
import { ICON_EMOJI } from "@/lib/season";

const NAV_ITEMS = [{ href: "/contractor/dashboard", label: "My Jobs" }];

const ContractorJobDetail: NextPage = () => {
    const router = useRouter();
    const toast = useToast();
    const { session, isReady } = useRequireRole("contractor");
    const [booking, setBooking] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const id = typeof router.query.id === "string" ? router.query.id : null;

    useEffect(() => {
        if (!isReady || !session || !id) return;
        apiGet<{ data: Booking }>(
            `/api/contractors/profiles/mine/bookings/${id}`,
            { token: session.token }
        )
            .then((res) => setBooking(res.data))
            .catch(() => setBooking(null))
            .finally(() => setIsLoading(false));
    }, [isReady, session, id]);

    const advanceStatus = async () => {
        if (!session || !booking) return;
        const nextStatus =
            booking.status === "ASSIGNED" ? "IN_PROGRESS" : "COMPLETED";
        setIsUpdating(true);

        try {
            await apiPatch(
                `/api/contractors/profiles/mine/bookings/${booking._id}/status`,
                { status: nextStatus },
                { token: session.token }
            );
            setBooking({ ...booking, status: nextStatus });
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : "Something went wrong.";
            toast({ title: message, status: "error" });
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isReady || isLoading) {
        return (
            <Center minH="100dvh">
                <Spinner size="lg" color="var(--season-primary)" />
            </Center>
        );
    }

    if (!booking) {
        return (
            <DashboardShell
                title="FrostFix Contractor"
                navItems={NAV_ITEMS}
                loginPath="/contractor/login"
            >
                <Text color="gray.400">Job not found.</Text>
            </DashboardShell>
        );
    }

    const homeowner =
        booking.homeowner && typeof booking.homeowner === "object"
            ? (booking.homeowner as ContactInfo)
            : null;

    return (
        <>
            <Head>
                <title>{booking.service.name} Job</title>
            </Head>
            <DashboardShell
                title="FrostFix Contractor"
                navItems={NAV_ITEMS}
                loginPath="/contractor/login"
            >
                <HStack justify="space-between" mb={2}>
                    <Heading fontSize={["xl", "2xl"]}>
                        {ICON_EMOJI[booking.service.icon]} {booking.service.name}
                    </Heading>
                    <BookingStatusBadge status={booking.status} />
                </HStack>

                <VStack
                    align="stretch"
                    spacing={3}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.100"
                    borderRadius="1rem"
                    p={5}
                    mt={4}
                    mb={6}
                >
                    <HStack justify="space-between">
                        <Text color="gray.500" fontSize="sm">
                            Date
                        </Text>
                        <Text fontWeight={600}>
                            {new Date(booking.scheduledDate).toLocaleDateString(
                                "en-US",
                                { weekday: "long", month: "long", day: "numeric" }
                            )}
                        </Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text color="gray.500" fontSize="sm">
                            Time
                        </Text>
                        <Text fontWeight={600}>{booking.timeSlot}</Text>
                    </HStack>
                    <HStack justify="space-between" align="flex-start">
                        <Text color="gray.500" fontSize="sm">
                            Address
                        </Text>
                        <Text fontWeight={600} textAlign="right">
                            {booking.address.street}, {booking.address.city},{" "}
                            {booking.address.state}
                        </Text>
                    </HStack>
                    {booking.notes && (
                        <HStack justify="space-between" align="flex-start">
                            <Text color="gray.500" fontSize="sm">
                                Notes
                            </Text>
                            <Text fontWeight={600} textAlign="right" maxW="65%">
                                {booking.notes}
                            </Text>
                        </HStack>
                    )}
                    {homeowner && (
                        <>
                            <Divider />
                            <HStack justify="space-between">
                                <Text color="gray.500" fontSize="sm">
                                    Homeowner
                                </Text>
                                <Text fontWeight={600}>
                                    {homeowner.fullName}
                                    {homeowner.phoneNumber
                                        ? ` · ${homeowner.phoneNumber}`
                                        : ""}
                                </Text>
                            </HStack>
                        </>
                    )}
                </VStack>

                {(booking.status === "ASSIGNED" ||
                    booking.status === "IN_PROGRESS") && (
                    <Button
                        w="100%"
                        bg="var(--season-primary)"
                        color="white"
                        isLoading={isUpdating}
                        onClick={advanceStatus}
                    >
                        {booking.status === "ASSIGNED"
                            ? "Start job"
                            : "Mark complete"}
                    </Button>
                )}
            </DashboardShell>
        </>
    );
};

export default ContractorJobDetail;
