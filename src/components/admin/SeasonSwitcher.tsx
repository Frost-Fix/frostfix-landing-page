import { FC, useState } from "react";
import { Box, SimpleGrid, Text, Heading, useToast } from "@chakra-ui/react";
import { apiPatch, ApiError } from "@/lib/api";
import { SEASONS, SEASON_META } from "@/lib/season";
import { Season } from "@/types/booking";

interface SeasonSwitcherProps {
    token: string;
    activeSeason: Season;
    onChange: (season: Season) => void;
}

const SeasonSwitcher: FC<SeasonSwitcherProps> = ({
    token,
    activeSeason,
    onChange,
}) => {
    const toast = useToast();
    const [isSaving, setIsSaving] = useState<Season | null>(null);

    const selectSeason = async (season: Season) => {
        if (season === activeSeason) return;
        setIsSaving(season);

        try {
            await apiPatch(
                "/api/admin/settings",
                { activeSeason: season },
                { token }
            );
            onChange(season);
            toast({
                title: `Site switched to ${SEASON_META[season].label} mode.`,
                status: "success",
            });
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : "Something went wrong.";
            toast({ title: message, status: "error" });
        } finally {
            setIsSaving(null);
        }
    };

    return (
        <Box bg="white" border="1px solid" borderColor="gray.100" borderRadius="1rem" p={5}>
            <Heading fontSize="md" mb={1}>
                Site Season
            </Heading>
            <Text fontSize="sm" color="gray.500" mb={4}>
                Controls which services customers see and the site&apos;s theme,
                everywhere, immediately.
            </Text>
            <SimpleGrid columns={[2, 4]} spacing={3}>
                {SEASONS.map((season) => {
                    const meta = SEASON_META[season];
                    const isActive = season === activeSeason;

                    return (
                        <Box
                            key={season}
                            as="button"
                            type="button"
                            onClick={() => selectSeason(season)}
                            opacity={isSaving && isSaving !== season ? 0.5 : 1}
                            textAlign="center"
                            py={4}
                            borderRadius="0.75rem"
                            border="2px solid"
                            borderColor={isActive ? meta.primary : "gray.100"}
                            bg={isActive ? `${meta.primary}0d` : "white"}
                        >
                            <Text fontSize="2xl">{meta.emoji}</Text>
                            <Text
                                fontSize="sm"
                                fontWeight={700}
                                color={isActive ? meta.primary : "gray.600"}
                            >
                                {meta.label}
                            </Text>
                            {isActive && (
                                <Text fontSize="xs" color="gray.400">
                                    Active
                                </Text>
                            )}
                        </Box>
                    );
                })}
            </SimpleGrid>
        </Box>
    );
};

export default SeasonSwitcher;
