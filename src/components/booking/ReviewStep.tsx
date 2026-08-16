import { FC } from "react";
import { VStack, Heading, Box, Text, HStack, Divider } from "@chakra-ui/react";
import { Address, PaymentMethod, Service, TimeSlot } from "@/types/booking";

interface ReviewStepProps {
    service: Service;
    address: Address;
    contactPhone: string;
    scheduledDate: string;
    slotLabel: string;
    paymentMethod: PaymentMethod;
    notes: string;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
    CASH: "Cash",
    E_TRANSFER: "E-Transfer",
    CARD_ON_FILE: "Card on File",
};

const Row: FC<{ label: string; value: string }> = ({ label, value }) => (
    <HStack justify="space-between" align="flex-start" w="100%">
        <Text color="gray.500" fontSize="sm">
            {label}
        </Text>
        <Text fontWeight={600} textAlign="right" maxW="60%">
            {value}
        </Text>
    </HStack>
);

const ReviewStep: FC<ReviewStepProps> = ({
    service,
    address,
    contactPhone,
    scheduledDate,
    slotLabel,
    paymentMethod,
    notes,
}) => {
    const dateLabel = new Date(`${scheduledDate}T00:00:00`).toLocaleDateString(
        "en-US",
        { weekday: "long", month: "long", day: "numeric" }
    );

    return (
        <VStack align="stretch" spacing={4} w="100%">
            <Heading fontSize={["lg", "xl"]} color="var(--season-primary)">
                Review & confirm
            </Heading>
            <Box
                border="1px solid"
                borderColor="gray.100"
                borderRadius="1rem"
                p={5}
            >
                <VStack spacing={3} align="stretch">
                    <Row label="Service" value={service.name} />
                    <Row
                        label="Address"
                        value={`${address.street}, ${address.city}, ${address.state} ${address.postalCode}`}
                    />
                    <Row label="Contact phone" value={contactPhone} />
                    <Row label="Date" value={dateLabel} />
                    <Row label="Time" value={slotLabel} />
                    <Row
                        label="Payment method"
                        value={PAYMENT_LABELS[paymentMethod]}
                    />
                    {notes && <Row label="Notes" value={notes} />}
                    <Divider />
                    <Row
                        label="Estimated price"
                        value={`$${service.basePrice}${
                            service.unit === "PER_HOUR" ? "/hr" : ""
                        }`}
                    />
                </VStack>
            </Box>
            <Text fontSize="xs" color="gray.400" textAlign="center">
                A contractor will be assigned shortly after you confirm. You
                can cancel for free up until 12 hours before your appointment.
            </Text>
        </VStack>
    );
};

export default ReviewStep;
