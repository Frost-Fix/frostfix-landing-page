import { FC } from "react";
import { HStack, Text } from "@chakra-ui/react";
import { useSeason } from "@/context/SeasonContext";
import { SEASON_META } from "@/lib/season";

const SeasonPill: FC = () => {
    const { season } = useSeason();
    const meta = SEASON_META[season];

    return (
        <HStack
            spacing={2}
            display="inline-flex"
            bg="whiteAlpha.800"
            border="1px solid"
            borderColor="blackAlpha.100"
            borderRadius="full"
            px={4}
            py={2}
            boxShadow="sm"
        >
            <Text fontSize="lg">{meta.emoji}</Text>
            <Text fontSize="sm" fontWeight={600} color={meta.primary}>
                {meta.label} services are open now
            </Text>
        </HStack>
    );
};

export default SeasonPill;
