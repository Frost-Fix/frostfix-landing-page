import { FC, ReactNode } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
    Box,
    Flex,
    HStack,
    VStack,
    Text,
    Link,
    Button,
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
    href: string;
    label: string;
}

interface DashboardShellProps {
    title: string;
    navItems: NavItem[];
    loginPath: string;
    children: ReactNode;
}

const DashboardShell: FC<DashboardShellProps> = ({
    title,
    navItems,
    loginPath,
    children,
}) => {
    const router = useRouter();
    const { logout } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleLogout = () => {
        logout();
        router.push(loginPath);
    };

    const NavLinksList = ({ onNavigate }: { onNavigate?: () => void }) => (
        <>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    as={NextLink}
                    href={item.href}
                    onClick={onNavigate}
                    fontWeight={600}
                    fontSize="sm"
                    px={3}
                    py={2}
                    borderRadius="0.5rem"
                    bg={
                        router.pathname === item.href
                            ? "var(--season-accent)"
                            : "transparent"
                    }
                    color={
                        router.pathname === item.href
                            ? "var(--season-primary)"
                            : "gray.600"
                    }
                    w={{ base: "100%", md: "auto" }}
                >
                    {item.label}
                </Link>
            ))}
        </>
    );

    return (
        <Box minH="100dvh" bg="gray.50">
            <Flex
                as="header"
                justify="space-between"
                align="center"
                px={[4, 8]}
                py={4}
                bg="white"
                borderBottom="1px solid"
                borderColor="gray.100"
                position="sticky"
                top={0}
                zIndex={5}
            >
                <Text fontWeight={700} color="var(--season-primary)">
                    {title}
                </Text>

                <HStack spacing={2} display={{ base: "none", md: "flex" }}>
                    <NavLinksList />
                    <Button size="sm" variant="outline" onClick={handleLogout}>
                        Log out
                    </Button>
                </HStack>

                <IconButton
                    aria-label="Open menu"
                    display={{ base: "flex", md: "none" }}
                    variant="ghost"
                    onClick={onOpen}
                    icon={<Text fontSize="xl">☰</Text>}
                />
            </Flex>

            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerBody pt={12}>
                        <VStack align="stretch" spacing={2}>
                            <NavLinksList onNavigate={onClose} />
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleLogout}
                            >
                                Log out
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <Box maxW="1000px" mx="auto" px={[4, 6]} py={[6, 8]}>
                {children}
            </Box>
        </Box>
    );
};

export default DashboardShell;
