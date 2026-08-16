import { FC, useEffect, useMemo, useState } from "react";
import {
    VStack,
    Heading,
    HStack,
    Box,
    Text,
    SimpleGrid,
    Button,
    Spinner,
    Center,
} from "@chakra-ui/react";
import { apiGet } from "@/lib/api";
import { SlotAvailability, TimeSlot } from "@/types/booking";

interface DateSlotStepProps {
    homeownerToken: string;
    scheduledDate: string | null;
    timeSlot: TimeSlot | null;
    onSelectDate: (date: string) => void;
    onSelectSlot: (slot: TimeSlot, label: string) => void;
}

const LEAD_DAYS = 60;

const toISODate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

const buildDateOptions = () => {
    const options: { iso: string; weekday: string; day: number; month: string }[] =
        [];
    const start = new Date();
    start.setDate(start.getDate() + 1); // tomorrow, matches backend lead time rule

    for (let i = 0; i < LEAD_DAYS; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        options.push({
            iso: toISODate(date),
            weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
            day: date.getDate(),
            month: date.toLocaleDateString("en-US", { month: "short" }),
        });
    }

    return options;
};

const DateSlotStep: FC<DateSlotStepProps> = ({
    homeownerToken,
    scheduledDate,
    timeSlot,
    onSelectDate,
    onSelectSlot,
}) => {
    const dateOptions = useMemo(buildDateOptions, []);
    const [slots, setSlots] = useState<SlotAvailability[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!scheduledDate) return;

        let cancelled = false;
        setIsLoadingSlots(true);
        setLoadError(false);

        apiGet<{ data: { slots: SlotAvailability[] } }>(
            "/api/homeowners/profiles/mine/bookings/availability",
            { token: homeownerToken, query: { date: scheduledDate } }
        )
            .then((res) => {
                if (!cancelled) setSlots(res.data.slots);
            })
            .catch(() => {
                if (!cancelled) {
                    setSlots([]);
                    setLoadError(true);
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoadingSlots(false);
            });

        return () => {
            cancelled = true;
        };
    }, [scheduledDate, homeownerToken]);

    return (
        <VStack align="stretch" spacing={4} w="100%">
            <Heading fontSize={["lg", "xl"]} color="var(--season-primary)">
                Pick a date & time
            </Heading>

            <Box overflowX="auto" pb={2} sx={{ WebkitOverflowScrolling: "touch" }}>
                <HStack spacing={2} minW="max-content">
                    {dateOptions.map((option) => {
                        const isSelected = option.iso === scheduledDate;

                        return (
                            <VStack
                                key={option.iso}
                                as="button"
                                type="button"
                                onClick={() => onSelectDate(option.iso)}
                                spacing={0}
                                flexShrink={0}
                                minW="64px"
                                py={2}
                                borderRadius="0.75rem"
                                border="2px solid"
                                borderColor={
                                    isSelected
                                        ? "var(--season-primary)"
                                        : "gray.100"
                                }
                                bg={isSelected ? "var(--season-accent)" : "white"}
                            >
                                <Text fontSize="xs" color="gray.500">
                                    {option.weekday}
                                </Text>
                                <Text fontWeight={700} fontSize="lg">
                                    {option.day}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    {option.month}
                                </Text>
                            </VStack>
                        );
                    })}
                </HStack>
            </Box>

            {scheduledDate && (
                <Box>
                    {isLoadingSlots ? (
                        <Center py={6}>
                            <Spinner color="var(--season-primary)" />
                        </Center>
                    ) : loadError ? (
                        <Text color="red.500" textAlign="center" py={6}>
                            Couldn&apos;t load times for this day. Try
                            selecting the date again.
                        </Text>
                    ) : slots.length === 0 ? (
                        <Text color="gray.400" textAlign="center" py={6}>
                            No time slots available for this day.
                        </Text>
                    ) : (
                        <SimpleGrid columns={[2, 4]} spacing={3}>
                            {slots.map((slot) => (
                                <Button
                                    key={slot.slot}
                                    size="lg"
                                    variant="outline"
                                    whiteSpace="normal"
                                    h="auto"
                                    py={3}
                                    isDisabled={!slot.available}
                                    onClick={() =>
                                        onSelectSlot(slot.slot, slot.label)
                                    }
                                    borderWidth="2px"
                                    borderColor={
                                        timeSlot === slot.slot
                                            ? "var(--season-primary)"
                                            : "gray.200"
                                    }
                                    bg={
                                        timeSlot === slot.slot
                                            ? "var(--season-accent)"
                                            : "white"
                                    }
                                    color="gray.700"
                                >
                                    <VStack spacing={0}>
                                        <Text fontSize="sm" fontWeight={600}>
                                            {slot.label}
                                        </Text>
                                        <Text fontSize="xs" color="gray.400">
                                            {slot.available
                                                ? `${slot.remaining} left`
                                                : "Full"}
                                        </Text>
                                    </VStack>
                                </Button>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            )}
        </VStack>
    );
};

export default DateSlotStep;
