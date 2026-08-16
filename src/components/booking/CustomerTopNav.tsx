import { FC } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Flex, HStack, Link, Button, Image, Text } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
    { href: "/booking/new", label: "Book a Service" },
    { href: "/bookings", label: "My Bookings" },
    { href: "/account", label: "Account" },
];

const CustomerTopNav: FC = () => {
    const router = useRouter();
    const { logout } = useAuth();

    return (
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
            <Link as={NextLink} href="/" display="flex" alignItems="center" gap={2}>
                <Image
                    src="/images/horai_logo.svg"
                    alt="FrostFix"
                    boxSize="32px"
                />
                <Text fontWeight={700} color="var(--season-primary)">
                    FrostFix
                </Text>
            </Link>

            <HStack spacing={[3, 6]}>
                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        as={NextLink}
                        href={link.href}
                        fontSize="sm"
                        fontWeight={600}
                        display={{ base: "none", sm: "block" }}
                        color={
                            router.pathname === link.href
                                ? "var(--season-primary)"
                                : "gray.500"
                        }
                    >
                        {link.label}
                    </Link>
                ))}
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                        logout();
                        router.push("/login");
                    }}
                >
                    Log out
                </Button>
            </HStack>
        </Flex>
    );
};

export default CustomerTopNav;
