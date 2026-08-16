import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState, FormEvent } from "react";
import {
    Box,
    Center,
    Spinner,
    VStack,
    HStack,
    Text,
    Heading,
    Switch,
    Select,
    Input,
    Textarea,
    Button,
    SimpleGrid,
    useToast,
    Divider,
} from "@chakra-ui/react";
import { useRequireRole } from "@/lib/useRequireRole";
import { apiGet, apiPatch, apiPost, ApiError } from "@/lib/api";
import { Service, ServiceIcon, ServiceSeason } from "@/types/booking";
import DashboardShell from "@/components/layout/DashboardShell";
import { ICON_EMOJI, serviceSeasonLabel } from "@/lib/season";

const NAV_ITEMS = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/services", label: "Services" },
];

const SEASON_OPTIONS: ServiceSeason[] = [
    "WINTER",
    "SPRING",
    "SUMMER",
    "FALL",
    "ALL_SEASON",
];
const ICON_OPTIONS: ServiceIcon[] = [
    "snowflake",
    "leaf",
    "sun",
    "droplet",
    "home",
    "tool",
];

const AdminServices: NextPage = () => {
    const toast = useToast();
    const { session, isReady } = useRequireRole("admin");
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [season, setSeason] = useState<ServiceSeason>("ALL_SEASON");
    const [icon, setIcon] = useState<ServiceIcon>("tool");
    const [basePrice, setBasePrice] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const loadServices = () => {
        if (!session) return;
        setIsLoading(true);
        apiGet<{ data: Service[] }>("/api/admin/services", {
            token: session.token,
        })
            .then((res) => setServices(res.data))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (isReady) loadServices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReady, session]);

    const toggleActive = async (service: Service) => {
        if (!session) return;

        try {
            await apiPatch(
                `/api/admin/services/${service._id}`,
                { isActive: !service.isActive },
                { token: session.token }
            );
            setServices((prev) =>
                prev.map((s) =>
                    s._id === service._id
                        ? { ...s, isActive: !s.isActive }
                        : s
                )
            );
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : "Something went wrong.";
            toast({ title: message, status: "error" });
        }
    };

    const createService = async (e: FormEvent) => {
        e.preventDefault();
        if (!session || !name || !description || !basePrice) return;
        setIsCreating(true);

        try {
            await apiPost(
                "/api/admin/services",
                {
                    name,
                    description,
                    season,
                    icon,
                    basePrice: Number(basePrice),
                },
                { token: session.token }
            );
            toast({ title: "Service created.", status: "success" });
            setName("");
            setDescription("");
            setBasePrice("");
            loadServices();
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : "Something went wrong.";
            toast({ title: message, status: "error" });
        } finally {
            setIsCreating(false);
        }
    };

    if (!isReady) {
        return (
            <Center minH="100dvh">
                <Spinner size="lg" color="var(--season-primary)" />
            </Center>
        );
    }

    return (
        <>
            <Head>
                <title>Admin Services</title>
            </Head>
            <DashboardShell
                title="FrostFix Admin"
                navItems={NAV_ITEMS}
                loginPath="/admin/login"
            >
                <Heading fontSize={["xl", "2xl"]} color="var(--season-primary)" mb={6}>
                    Services
                </Heading>

                {isLoading ? (
                    <Center py={10}>
                        <Spinner color="var(--season-primary)" />
                    </Center>
                ) : (
                    <VStack spacing={3} align="stretch" mb={8}>
                        {services.map((service) => (
                            <HStack
                                key={service._id}
                                justify="space-between"
                                bg="white"
                                border="1px solid"
                                borderColor="gray.100"
                                borderRadius="1rem"
                                p={4}
                            >
                                <HStack spacing={3}>
                                    <Text fontSize="xl">
                                        {ICON_EMOJI[service.icon]}
                                    </Text>
                                    <Box>
                                        <Text fontWeight={700}>{service.name}</Text>
                                        <Text fontSize="xs" color="gray.500">
                                            {serviceSeasonLabel(service.season)} · $
                                            {service.basePrice}
                                        </Text>
                                    </Box>
                                </HStack>
                                <Switch
                                    isChecked={service.isActive}
                                    onChange={() => toggleActive(service)}
                                    colorScheme="green"
                                />
                            </HStack>
                        ))}
                    </VStack>
                )}

                <Divider mb={6} />

                <Heading fontSize="lg" mb={4}>
                    Add a service
                </Heading>
                <Box
                    as="form"
                    onSubmit={createService}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.100"
                    borderRadius="1rem"
                    p={5}
                >
                    <VStack spacing={4} align="stretch">
                        <Input
                            placeholder="Service name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <SimpleGrid columns={[1, 3]} spacing={3}>
                            <Select
                                value={season}
                                onChange={(e) =>
                                    setSeason(e.target.value as ServiceSeason)
                                }
                            >
                                {SEASON_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                        {serviceSeasonLabel(s)}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                value={icon}
                                onChange={(e) =>
                                    setIcon(e.target.value as ServiceIcon)
                                }
                            >
                                {ICON_OPTIONS.map((i) => (
                                    <option key={i} value={i}>
                                        {ICON_EMOJI[i]} {i}
                                    </option>
                                ))}
                            </Select>
                            <Input
                                type="number"
                                placeholder="Base price ($)"
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                                required
                            />
                        </SimpleGrid>
                        <Button
                            type="submit"
                            alignSelf="flex-start"
                            bg="var(--season-primary)"
                            color="white"
                            isLoading={isCreating}
                        >
                            Add service
                        </Button>
                    </VStack>
                </Box>
            </DashboardShell>
        </>
    );
};

export default AdminServices;
