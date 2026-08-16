import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
    Box,
    Center,
    Spinner,
    VStack,
    HStack,
    Text,
    Heading,
    Select,
    useToast,
} from "@chakra-ui/react";
import { useRequireRole } from "@/lib/useRequireRole";
import { apiGet, apiPatch, ApiError } from "@/lib/api";
import { Booking, BookingStatus, ContactInfo } from "@/types/booking";
import DashboardShell from "@/components/layout/DashboardShell";
import BookingStatusBadge from "@/components/booking/BookingStatusBadge";

const NAV_ITEMS = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/services", label: "Services" },
];

const STATUS_OPTIONS: BookingStatus[] = [
    "PENDING_ASSIGNMENT",
    "ASSIGNED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
];

interface ContractorOption {
    _id: string;
    fullName: string;
    isAvailable: boolean;
}

const AdminBookings: NextPage = () => {
    const toast = useToast();
    const { session, isReady } = useRequireRole("admin");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [contractors, setContractors] = useState<ContractorOption[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const loadBookings = () => {
        if (!session) return;
        setIsLoading(true);
        apiGet<{ data: Booking[] }>("/api/admin/bookings", {
            token: session.token,
            query: { status: statusFilter },
        })
            .then((res) => setBookings(res.data))
            .catch(() => setBookings([]))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (!isReady || !session) return;
        loadBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReady, session, statusFilter]);

    useEffect(() => {
        if (!isReady || !session) return;
        apiGet<{ data: ContractorOption[] }>("/api/admin/contractors", {
            token: session.token,
        }).then((res) => setContractors(res.data));
    }, [isReady, session]);

    const assignContractor = async (bookingId: string, contractorId: string) => {
        if (!session || !contractorId) return;

        try {
            await apiPatch(
                `/api/admin/bookings/${bookingId}/assign`,
                { contractorId },
                { token: session.token }
            );
            toast({ title: "Contractor assigned.", status: "success" });
            loadBookings();
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : "Something went wrong.";
            toast({ title: message, status: "error" });
        }
    };

    const overrideStatus = async (bookingId: string, status: string) => {
        if (!session) return;

        try {
            await apiPatch(
                `/api/admin/bookings/${bookingId}/status`,
                { status },
                { token: session.token }
            );
            toast({ title: "Status updated.", status: "success" });
            loadBookings();
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
                <title>Admin Bookings</title>
            </Head>
            <DashboardShell
                title="FrostFix Admin"
                navItems={NAV_ITEMS}
                loginPath="/admin/login"
            >
                <HStack justify="space-between" mb={6} wrap="wrap" gap={4}>
                    <Heading fontSize={["xl", "2xl"]} color="var(--season-primary)">
                        Bookings
                    </Heading>
                    <Select
                        w="220px"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        bg="white"
                    >
                        <option value="">All statuses</option>
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </Select>
                </HStack>

                {isLoading ? (
                    <Center py={10}>
                        <Spinner color="var(--season-primary)" />
                    </Center>
                ) : bookings.length === 0 ? (
                    <Text color="gray.400" py={10} textAlign="center">
                        No bookings found.
                    </Text>
                ) : (
                    <VStack spacing={3} align="stretch">
                        {bookings.map((booking) => {
                            const homeowner =
                                typeof booking.homeowner === "object"
                                    ? (booking.homeowner as ContactInfo)
                                    : null;
                            const contractor =
                                booking.contractor &&
                                typeof booking.contractor === "object"
                                    ? (booking.contractor as ContactInfo)
                                    : null;

                            return (
                                <Box
                                    key={booking._id}
                                    bg="white"
                                    border="1px solid"
                                    borderColor="gray.100"
                                    borderRadius="1rem"
                                    p={4}
                                >
                                    <HStack justify="space-between" mb={2} wrap="wrap">
                                        <Text fontWeight={700}>
                                            {booking.service?.name}
                                        </Text>
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
                                        · {booking.timeSlot} ·{" "}
                                        {booking.address.city}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500" mb={3}>
                                        {homeowner?.fullName} ·{" "}
                                        {homeowner?.phoneNumber || homeowner?.email}
                                    </Text>

                                    <HStack spacing={3} wrap="wrap">
                                        <Select
                                            size="sm"
                                            maxW="220px"
                                            placeholder={
                                                contractor
                                                    ? contractor.fullName
                                                    : "Assign contractor..."
                                            }
                                            onChange={(e) =>
                                                assignContractor(
                                                    booking._id,
                                                    e.target.value
                                                )
                                            }
                                            isDisabled={
                                                !["PENDING_ASSIGNMENT", "ASSIGNED"].includes(
                                                    booking.status
                                                )
                                            }
                                        >
                                            {contractors.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.fullName}
                                                    {c.isAvailable ? "" : " (unavailable)"}
                                                </option>
                                            ))}
                                        </Select>

                                        <Select
                                            size="sm"
                                            maxW="200px"
                                            value={booking.status}
                                            onChange={(e) =>
                                                overrideStatus(
                                                    booking._id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {STATUS_OPTIONS.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </Select>
                                    </HStack>
                                </Box>
                            );
                        })}
                    </VStack>
                )}
            </DashboardShell>
        </>
    );
};

export default AdminBookings;
