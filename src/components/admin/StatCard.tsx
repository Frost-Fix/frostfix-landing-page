import { FC } from "react";
import { Box, Text } from "@chakra-ui/react";

interface StatCardProps {
    label: string;
    value: string | number;
    emoji: string;
}

const StatCard: FC<StatCardProps> = ({ label, value, emoji }) => (
    <Box
        bg="white"
        border="1px solid"
        borderColor="gray.100"
        borderRadius="1rem"
        p={5}
    >
        <Text fontSize="2xl">{emoji}</Text>
        <Text fontSize="2xl" fontWeight={800} color="var(--season-primary)">
            {value}
        </Text>
        <Text fontSize="sm" color="gray.500">
            {label}
        </Text>
    </Box>
);

export default StatCard;
