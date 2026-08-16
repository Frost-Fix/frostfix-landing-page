import { FC, useEffect, useState } from "react";
import {
    SimpleGrid,
    Box,
    Text,
    Heading,
    VStack,
    Spinner,
    Center,
    Badge,
} from "@chakra-ui/react";
import { apiGet } from "@/lib/api";
import { Service } from "@/types/booking";
import { ICON_EMOJI, serviceSeasonLabel } from "@/lib/season";

interface ServiceStepProps {
    selectedServiceId: string | null;
    onSelect: (service: Service) => void;
}

const ServiceStep: FC<ServiceStepProps> = ({ selectedServiceId, onSelect }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await apiGet<{ data: Service[] }>(
                    "/api/services",
                    { query: { season: "CURRENT" } }
                );
                setServices(res.data);
            } catch (err) {
                setError("Couldn't load services. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, []);

    if (isLoading) {
        return (
            <Center py={10}>
                <Spinner color="var(--season-primary)" size="lg" />
            </Center>
        );
    }

    if (error) {
        return (
            <Text color="red.500" textAlign="center">
                {error}
            </Text>
        );
    }

    return (
        <VStack align="stretch" spacing={4} w="100%">
            <Heading fontSize={["lg", "xl"]} color="var(--season-primary)">
                What do you need done?
            </Heading>
            <SimpleGrid columns={[1, 2]} spacing={4}>
                {services.map((service) => {
                    const isSelected = service._id === selectedServiceId;

                    return (
                        <Box
                            key={service._id}
                            as="button"
                            type="button"
                            onClick={() => onSelect(service)}
                            textAlign="left"
                            p={4}
                            borderRadius="1rem"
                            border="2px solid"
                            borderColor={
                                isSelected ? "var(--season-primary)" : "gray.100"
                            }
                            bg={isSelected ? "var(--season-accent)" : "white"}
                            transition="all 0.15s ease"
                            _hover={{ borderColor: "var(--season-secondary)" }}
                        >
                            <Text fontSize="2xl" mb={1}>
                                {ICON_EMOJI[service.icon]}
                            </Text>
                            <Text fontWeight={700} color="gray.800">
                                {service.name}
                            </Text>
                            <Text fontSize="sm" color="gray.500" mt={1}>
                                {service.description}
                            </Text>
                            <Box mt={3} display="flex" gap={2} alignItems="center">
                                <Badge
                                    colorScheme="blackAlpha"
                                    borderRadius="full"
                                    px={2}
                                >
                                    {serviceSeasonLabel(service.season)}
                                </Badge>
                                <Text fontWeight={700} color="var(--season-primary)">
                                    ${service.basePrice}
                                    {service.unit === "PER_HOUR" && "/hr"}
                                </Text>
                            </Box>
                        </Box>
                    );
                })}
            </SimpleGrid>
            {services.length === 0 && (
                <Text color="gray.500" textAlign="center" py={6}>
                    No services are available right now. Please check back
                    soon.
                </Text>
            )}
        </VStack>
    );
};

export default ServiceStep;
