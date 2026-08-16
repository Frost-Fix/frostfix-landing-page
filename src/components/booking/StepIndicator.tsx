import { FC } from "react";
import { HStack, VStack, Box, Text, Circle } from "@chakra-ui/react";

interface StepIndicatorProps {
    steps: string[];
    currentStep: number;
}

const StepIndicator: FC<StepIndicatorProps> = ({ steps, currentStep }) => {
    return (
        <HStack spacing={0} w="100%" align="flex-start">
            {steps.map((label, index) => {
                const isComplete = index < currentStep;
                const isActive = index === currentStep;

                return (
                    <HStack key={label} flex={1} spacing={0} align="center">
                        <VStack spacing={1} flexShrink={0}>
                            <Circle
                                size={["28px", "34px"]}
                                bg={
                                    isComplete || isActive
                                        ? "var(--season-primary)"
                                        : "gray.100"
                                }
                                color={
                                    isComplete || isActive
                                        ? "white"
                                        : "gray.400"
                                }
                                fontWeight={700}
                                fontSize={["xs", "sm"]}
                                border={
                                    isActive
                                        ? "3px solid var(--season-secondary)"
                                        : "none"
                                }
                            >
                                {isComplete ? "✓" : index + 1}
                            </Circle>
                            <Text
                                fontSize={["2xs", "xs"]}
                                color={isActive ? "var(--season-primary)" : "gray.400"}
                                fontWeight={isActive ? 700 : 500}
                                display={{ base: "none", sm: "block" }}
                            >
                                {label}
                            </Text>
                        </VStack>
                        {index < steps.length - 1 && (
                            <Box
                                flex={1}
                                h="2px"
                                bg={isComplete ? "var(--season-primary)" : "gray.100"}
                                mx={1}
                                mt={["-14px", "-16px"]}
                            />
                        )}
                    </HStack>
                );
            })}
        </HStack>
    );
};

export default StepIndicator;
