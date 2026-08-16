import { FC } from "react";
import {
    VStack,
    Heading,
    SimpleGrid,
    Box,
    Text,
    FormControl,
    FormLabel,
    Textarea,
} from "@chakra-ui/react";
import { PaymentMethod } from "@/types/booking";

interface PaymentStepProps {
    paymentMethod: PaymentMethod | null;
    notes: string;
    onSelectPaymentMethod: (method: PaymentMethod) => void;
    onChangeNotes: (notes: string) => void;
}

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string }[] = [
    { value: "CASH", label: "Cash", hint: "Pay your contractor on-site" },
    {
        value: "E_TRANSFER",
        label: "E-Transfer",
        hint: "Send an e-transfer once the job is done",
    },
    {
        value: "CARD_ON_FILE",
        label: "Card on File",
        hint: "Coming soon — we'll follow up to collect details",
    },
];

const PaymentStep: FC<PaymentStepProps> = ({
    paymentMethod,
    notes,
    onSelectPaymentMethod,
    onChangeNotes,
}) => {
    return (
        <VStack align="stretch" spacing={4} w="100%">
            <Heading fontSize={["lg", "xl"]} color="var(--season-primary)">
                How would you like to pay?
            </Heading>
            <SimpleGrid columns={[1, 3]} spacing={3}>
                {PAYMENT_OPTIONS.map((option) => {
                    const isSelected = paymentMethod === option.value;

                    return (
                        <Box
                            key={option.value}
                            as="button"
                            type="button"
                            onClick={() => onSelectPaymentMethod(option.value)}
                            textAlign="left"
                            p={4}
                            borderRadius="1rem"
                            border="2px solid"
                            borderColor={
                                isSelected ? "var(--season-primary)" : "gray.100"
                            }
                            bg={isSelected ? "var(--season-accent)" : "white"}
                        >
                            <Text fontWeight={700}>{option.label}</Text>
                            <Text fontSize="xs" color="gray.500" mt={1}>
                                {option.hint}
                            </Text>
                        </Box>
                    );
                })}
            </SimpleGrid>
            <FormControl>
                <FormLabel>Anything we should know?</FormLabel>
                <Textarea
                    value={notes}
                    onChange={(e) => onChangeNotes(e.target.value)}
                    placeholder="Gate code, pets, where to park, etc. (optional)"
                    rows={4}
                />
            </FormControl>
        </VStack>
    );
};

export default PaymentStep;
