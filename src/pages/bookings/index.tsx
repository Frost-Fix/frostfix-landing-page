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
    Tabs,
    TabList,
    Tab,
    Link,
} from "@chakra-ui/react";
import { useRequireRole } from "@/lib/useRequireRole";
import { apiGet } from "@/lib/api";
import { Booking } from "@/types/booking";
import CustomerTopNav from "@/components/booking/CustomerTopNav";
import BookingStatusBadge from "@/components/booking/BookingStatusBadge";
import PrimaryButton from "@/components/core/Buttons/PrimaryButton";
import { ICON_EMOJI } from "@/lib/season";

const BookingsList: NextPage = () => {
    const { session, isReady } = useRequireRole("homeowner");
    const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isReady || !session) return;

        setIsLoading(true);
        apiGet<{ data: Booking[] }>(
            "/api/homeowners/profiles/mine/bookings",
            {
                token: session.token,
                query: { upcoming: tab === "upcoming" ? "true" : "false" },
            }
        )
            .then((res) => setBookings(res.data))
            .catch(() => setBookings([]))
            .finally(() => setIsLoading(false));
    }, [isReady, session, tab]);

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
                <title>My Bookings</title>
            </Head>
            <CustomerTopNav />
            <Box maxW="800px" mx="auto" px={[4, 6]} py={[6, 10]}>
                <HStack justify="space-between" mb={6}>
                    <Heading fontSize={["xl", "2xl"]} color="var(--season-primary)">
                        My Bookings
                    </Heading>
                    <PrimaryButton as={NextLink} href="/booking/new">
                        + New Booking
                    </PrimaryButton>
                </HStack>

                <Tabs
                    index={tab === "upcoming" ? 0 : 1}
                    onChange={(i) => setTab(i === 0 ? "upcoming" : "past")}
                    mb={6}
                >
                    <TabList>
                        <Tab>Upcoming</Tab>
                        <Tab>Past</Tab>
                    </TabList>
                </Tabs>

                {isLoading ? (
                    <Center py={10}>
                        <Spinner color="var(--season-primary)" />
                    </Center>
                ) : bookings.length === 0 ? (
                    <VStack py={10} color="gray.400">
                        <Text fontSize="4xl">📭</Text>
                        <Text>No {tab} bookings yet.</Text>
                    </VStack>
                ) : (
                    <VStack spacing={3} align="stretch">
                        {bookings.map((booking) => (
                            <Link
                                key={booking._id}
                                as={NextLink}
                                href={`/bookings/${booking._id}`}
                                _hover={{ textDecoration: "none" }}
                            >
                                <HStack
                                    justify="space-between"
                                    p={4}
                                    border="1px solid"
                                    borderColor="gray.100"
                                    borderRadius="1rem"
                                    _hover={{
                                        borderColor: "var(--season-secondary)",
                                    }}
                                >
                                    <HStack spacing={4}>
                                        <Text fontSize="2xl">
                                            {ICON_EMOJI[booking.service.icon]}
                                        </Text>
                                        <Box>
                                            <Text fontWeight={700}>
                                                {booking.service.name}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {new Date(
                                                    booking.scheduledDate
                                                ).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </Text>
                                        </Box>
                                    </HStack>
                                    <BookingStatusBadge status={booking.status} />
                                </HStack>
                            </Link>
                        ))}
                    </VStack>
                )}
            </Box>
        </>
    );
};

export default BookingsList;
