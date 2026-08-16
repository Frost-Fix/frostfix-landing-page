import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
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
    Circle,
} from "@chakra-ui/react";
import { useRequireRole } from "@/lib/useRequireRole";
import { apiGet, apiPatch, ApiError } from "@/lib/api";
import { Booking, ContactInfo } from "@/types/booking";
import CustomerTopNav from "@/components/booking/CustomerTopNav";
import BookingStatusBadge from "@/components/booking/BookingStatusBadge";
import { ICON_EMOJI } from "@/lib/season";

const STATUS_ORDER = [
    "PENDING_ASSIGNMENT",
    "ASSIGNED",
    "IN_PROGRESS",
    "COMPLETED",
];

const isCancellable = (booking: Booking) => {
    if (!["PENDING_ASSIGNMENT", "ASSIGNED"].includes(booking.status)) {
        return false;
    }
    const twelveHoursFromNow = Date.now() + 12 * 60 * 60 * 1000;
    return new Date(booking.scheduledDate).getTime() > twelveHoursFromNow;
};

const BookingDetail: NextPage = () => {
    const router = useRouter();
    const toast = useToast();
    const { session, isReady } = useRequireRole("homeowner");
    const [booking, setBooking] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);

    const id = typeof router.query.id === "string" ? router.query.id : null;

    const loadBooking = useCallback(() => {
        if (!session || !id) return;
        setIsLoading(true);
        apiGet<{ data: Booking }>(
            `/api/homeowners/profiles/mine/bookings/${id}`,
            { token: session.token }
        )
            .then((res) => setBooking(res.data))
            .catch(() => setBooking(null))
            .finally(() => setIsLoading(false));
    }, [session, id]);

    useEffect(() => {
        if (isReady) loadBooking();
    }, [isReady, loadBooking]);

    const handleCancel = async () => {
        if (!booking || !session) return;
        setIsCancelling(true);

        try {
            await apiPatch(
                `/api/homeowners/profiles/mine/bookings/${booking._id}/cancel`,
                {},
                { token: session.token }
            );
            toast({ title: "Booking cancelled.", status: "success" });
            loadBooking();
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : "Something went wrong.";
            toast({ title: message, status: "error" });
        } finally {
            setIsCancelling(false);
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
            <>
                <CustomerTopNav />
                <Center py={20}>
                    <Text color="gray.400">Booking not found.</Text>
                </Center>
            </>
        );
    }

    const contractor =
        booking.contractor && typeof booking.contractor === "object"
            ? (booking.contractor as ContactInfo)
            : null;

    const currentStepIndex = STATUS_ORDER.indexOf(booking.status);

    return (
        <>
            <Head>
                <title>{booking.service.name} Booking</title>
            </Head>
            <CustomerTopNav />
            <Box maxW="640px" mx="auto" px={[4, 6]} py={[6, 10]}>
                <HStack justify="space-between" mb={2}>
                    <Heading fontSize={["xl", "2xl"]}>
                        {ICON_EMOJI[booking.service.icon]} {booking.service.name}
                    </Heading>
                    <BookingStatusBadge status={booking.status} />
                </HStack>
                <Text color="gray.500" mb={6}>
                    {new Date(booking.scheduledDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                    })}
                </Text>

                {booking.status !== "CANCELLED" && (
                    <HStack spacing={0} mb={8} align="flex-start">
                        {STATUS_ORDER.map((status, index) => (
                            <HStack key={status} flex={1} spacing={0}>
                                <Circle
                                    size="24px"
                                    bg={
                                        index <= currentStepIndex
                                            ? "var(--season-primary)"
                                            : "gray.100"
                                    }
                                    flexShrink={0}
                                />
                                {index < STATUS_ORDER.length - 1 && (
                                    <Box
                                        flex={1}
                                        h="2px"
                                        bg={
                                            index < currentStepIndex
                                                ? "var(--season-primary)"
                                                : "gray.100"
                                        }
                                    />
                                )}
                            </HStack>
                        ))}
                    </HStack>
                )}

                <VStack
                    align="stretch"
                    spacing={3}
                    border="1px solid"
                    borderColor="gray.100"
                    borderRadius="1rem"
                    p={5}
                    mb={6}
                >
                    <HStack justify="space-between">
                        <Text color="gray.500" fontSize="sm">
                            Address
                        </Text>
                        <Text fontWeight={600} textAlign="right">
                            {booking.address.street}, {booking.address.city}
                        </Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text color="gray.500" fontSize="sm">
                            Time
                        </Text>
                        <Text fontWeight={600}>{booking.timeSlot}</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text color="gray.500" fontSize="sm">
                            Estimated price
                        </Text>
                        <Text fontWeight={600}>${booking.estimatedPrice}</Text>
                    </HStack>
                    {contractor && (
                        <>
                            <Divider />
                            <HStack justify="space-between">
                                <Text color="gray.500" fontSize="sm">
                                    Contractor
                                </Text>
                                <Text fontWeight={600}>
                                    {contractor.fullName}
                                    {contractor.phoneNumber
                                        ? ` · ${contractor.phoneNumber}`
                                        : ""}
                                </Text>
                            </HStack>
                        </>
                    )}
                    {booking.status === "CANCELLED" &&
                        booking.cancellationReason && (
                            <>
                                <Divider />
                                <Text fontSize="sm" color="red.500">
                                    Cancelled: {booking.cancellationReason}
                                </Text>
                            </>
                        )}
                </VStack>

                {isCancellable(booking) && (
                    <Button
                        w="100%"
                        variant="outline"
                        colorScheme="red"
                        isLoading={isCancelling}
                        onClick={handleCancel}
                    >
                        Cancel booking
                    </Button>
                )}
            </Box>
        </>
    );
};

export default BookingDetail;
