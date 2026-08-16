import { FC, ReactNode } from "react";
import { Box, Center, Heading, Text, VStack } from "@chakra-ui/react";
import Logo from "@/components/core/Logo";

interface AuthLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    footer?: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({
    title,
    subtitle,
    children,
    footer,
}) => {
    return (
        <Box
            minH="100dvh"
            bgGradient="linear(to-b, var(--season-bg-from), var(--season-bg-to))"
        >
            <Center py={[8, 12]} px={4}>
                <VStack
                    spacing={6}
                    w="100%"
                    maxW="420px"
                    bg="white"
                    borderRadius="1.25rem"
                    boxShadow="0 10px 40px rgba(11, 37, 69, 0.08)"
                    p={[6, 8]}
                >
                    <Logo />

                    <VStack spacing={1} textAlign="center">
                        <Heading
                            fontSize={["xl", "2xl"]}
                            color="var(--season-primary)"
                        >
                            {title}
                        </Heading>
                        {subtitle && (
                            <Text fontSize="sm" color="gray.500">
                                {subtitle}
                            </Text>
                        )}
                    </VStack>

                    <VStack spacing={4} w="100%">
                        {children}
                    </VStack>

                    {footer && <Box pt={2}>{footer}</Box>}
                </VStack>
            </Center>
        </Box>
    );
};

export default AuthLayout;
