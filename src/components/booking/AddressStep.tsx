import { FC } from "react";
import {
    VStack,
    Heading,
    FormControl,
    FormLabel,
    Input,
    SimpleGrid,
} from "@chakra-ui/react";
import { Address } from "@/types/booking";

interface AddressStepProps {
    address: Address;
    contactPhone: string;
    onChangeAddress: (address: Address) => void;
    onChangePhone: (phone: string) => void;
}

const AddressStep: FC<AddressStepProps> = ({
    address,
    contactPhone,
    onChangeAddress,
    onChangePhone,
}) => {
    const setField = (field: keyof Address) => (value: string) =>
        onChangeAddress({ ...address, [field]: value });

    return (
        <VStack align="stretch" spacing={4} w="100%">
            <Heading fontSize={["lg", "xl"]} color="var(--season-primary)">
                Where should we go?
            </Heading>
            <FormControl isRequired>
                <FormLabel>Street address</FormLabel>
                <Input
                    size="lg"
                    value={address.street}
                    onChange={(e) => setField("street")(e.target.value)}
                    placeholder="123 Main St"
                />
            </FormControl>
            <SimpleGrid columns={[1, 2]} spacing={4}>
                <FormControl isRequired>
                    <FormLabel>City</FormLabel>
                    <Input
                        size="lg"
                        value={address.city}
                        onChange={(e) => setField("city")(e.target.value)}
                        placeholder="Toronto"
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Province / State</FormLabel>
                    <Input
                        size="lg"
                        value={address.state}
                        onChange={(e) => setField("state")(e.target.value)}
                        placeholder="ON"
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Postal code</FormLabel>
                    <Input
                        size="lg"
                        value={address.postalCode}
                        onChange={(e) => setField("postalCode")(e.target.value)}
                        placeholder="M5V 2T6"
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Country</FormLabel>
                    <Input
                        size="lg"
                        value={address.country || "Canada"}
                        onChange={(e) => setField("country")(e.target.value)}
                    />
                </FormControl>
            </SimpleGrid>
            <FormControl isRequired>
                <FormLabel>Contact phone number</FormLabel>
                <Input
                    size="lg"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => onChangePhone(e.target.value)}
                    placeholder="(555) 123-4567"
                />
            </FormControl>
        </VStack>
    );
};

export default AddressStep;
