import { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import {
    Box,
    Center,
    Spinner,
    VStack,
    HStack,
    Text,
    Heading,
    Switch,
    FormControl,
    FormLabel,
    Link,
    useToast,
} from "@chakra-ui/react";
import { useRequireRole } from "@/lib/useRequireRole";
import { apiGet, apiPatch, ApiError } from "@/lib/api";
import { Booking } from "@/types/booking";
import DashboardShell from "@/components/layout/DashboardShell";
import BookingStatusBadge from "@/components/booking/BookingStatusBadge";
import { ICON_EMOJI } from "@/lib/season";

const NAV_ITEMS = [{ href: "/contractor/dashboard", label: "My Jobs" }];

const ContractorDashboard: NextPage = () => {
    const toast = useToast();
    const { session, isReady } = useRequireRole("contractor");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAvailable, setIsAvailable] = useState(
        session?.profile?.isAvailable ?? true
    );

    useEffect(() => {
        if (!isReady || !session) return;
        setIsAvailable(session.profile?.isAvailable ?? true);
        apiGet<{ data: Booking[] }>(
            "/api/contractors/profiles/mine/bookings",
            { token: session.token }
        )
            .then((res) => setBookings(res.data))
            .catch(() => setBookings([]))
            .finally(() => setIsLoading(false));
    }, [isReady, session]);

    const toggleAvailability = async () => {
        if (!session) return;
        const next = !isAvailable;
        setIsAvailable(next);

        try {
            await apiPatch(
                "/api/contractors/profiles/mine/availability",
                { isAvailable: next },
                { token: session.token }
            );
        } catch (err) {
            setIsAvailable(!next);
            const message =
                err instanceof ApiError ? err.message : "Something went wrong.";
            toast({ title: message, status: "error" });
        }
    };

    const advanceStatus = async (booking: Booking) => {
        if (!session) return;
        const nextStatus =
            booking.status === "ASSIGNED" ? "IN_PROGRESS" : "COMPLETED";

        try {
            await apiPatch(
                `/api/contractors/profiles/mine/bookings/${booking._id}/status`,
                { status: nextStatus },
                { token: session.token }
            );
            setBookings((prev) =>
                prev.map((b) =>
                    b._id === booking._id ? { ...b, status: nextStatus } : b
                )
            );
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : "Something went wrong.";
            toast({ title: message, status: "error" });
        }
    };

    if (!isReady) {
        return (
            <Center minH="100dvh">
                <Spinner size="lg" color="var(--season-primary)" />
            </Center>
        );
    }

    return (
        <>
            <Head>
                <title>Contractor Dashboard</title>
            </Head>
            <DashboardShell
                title="FrostFix Contractor"
                navItems={NAV_ITEMS}
                loginPath="/contractor/login"
            >
                <HStack justify="space-between" mb={6} wrap="wrap" gap={4}>
                    <Heading fontSize={["xl", "2xl"]} color="var(--season-primary)">
                        My Jobs
                    </Heading>
                    <FormControl display="flex" alignItems="center" w="auto">
                        <FormLabel mb={0} fontSize="sm">
                            Available for new jobs
                        </FormLabel>
                        <Switch
                            isChecked={isAvailable}
                            onChange={toggleAvailability}
                            colorScheme="green"
                        />
                    </FormControl>
                </HStack>

                {isLoading ? (
                    <Center py={10}>
                        <Spinner color="var(--season-primary)" />
                    </Center>
                ) : bookings.length === 0 ? (
                    <VStack py={10} color="gray.400">
                        <Text fontSize="4xl">🧰</Text>
                        <Text>No jobs assigned to you yet.</Text>
                    </VStack>
                ) : (
                    <VStack spacing={3} align="stretch">
                        {bookings.map((booking) => (
                            <Box
                                key={booking._id}
                                p={4}
                                bg="white"
                                border="1px solid"
                                borderColor="gray.100"
                                borderRadius="1rem"
                            >
                                <HStack justify="space-between" mb={2}>
                                    <Link
                                        as={NextLink}
                                        href={`/contractor/jobs/${booking._id}`}
                                        fontWeight={700}
                                    >
                                        {ICON_EMOJI[booking.service.icon]}{" "}
                                        {booking.service.name}
                                    </Link>
                                    <BookingStatusBadge status={booking.status} />
                                </HStack>
                                <Text fontSize="sm" color="gray.500" mb={1}>
                                    {new Date(
                                        booking.scheduledDate
                                    ).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                    })}{" "}
                                    · {booking.address.street}, {booking.address.city}
                                </Text>
                                {(booking.status === "ASSIGNED" ||
                                    booking.status === "IN_PROGRESS") && (
                                    <Link
                                        as="button"
                                        fontSize="sm"
                                        fontWeight={700}
                                        color="var(--season-primary)"
                                        onClick={() => advanceStatus(booking)}
                                    >
                                        {booking.status === "ASSIGNED"
                                            ? "Start job →"
                                            : "Mark complete →"}
                                    </Link>
                                )}
                            </Box>
                        ))}
                    </VStack>
                )}
            </DashboardShell>
        </>
    );
};

export default ContractorDashboard;
