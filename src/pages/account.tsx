import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
    Box,
    Center,
    Spinner,
    VStack,
    HStack,
    Text,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Select,
    useToast,
    Divider,
} from "@chakra-ui/react";
import { useRequireRole } from "@/lib/useRequireRole";
import { apiGet, apiPatch, apiPost, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import CustomerTopNav from "@/components/booking/CustomerTopNav";
import PrimaryButton from "@/components/core/Buttons/PrimaryButton";

interface HomeownerProfile {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    home?: {
        _id: string;
        address: {
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
        };
        homeType: string;
    } | null;
}

const HOME_TYPES = ["Detached", "Semi-Detached", "Townhouse", "Condo"];

const Account: NextPage = () => {
    const toast = useToast();
    const { session, isReady } = useRequireRole("homeowner");
    const { updateProfile } = useAuth();
    const [profile, setProfile] = useState<HomeownerProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const [homeType, setHomeType] = useState(HOME_TYPES[0]);
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [isSavingHome, setIsSavingHome] = useState(false);

    useEffect(() => {
        if (!isReady || !session) return;

        apiGet<{ data: HomeownerProfile }>(
            "/api/homeowners/profiles/mine",
            { token: session.token }
        )
            .then((res) => {
                setProfile(res.data);
                setPhoneNumber(res.data.phoneNumber || "");
                if (res.data.home) {
                    setHomeType(res.data.home.homeType);
                    setStreet(res.data.home.address.street);
                    setCity(res.data.home.address.city);
                    setState(res.data.home.address.state);
                    setPostalCode(res.data.home.address.postalCode);
                }
            })
            .finally(() => setIsLoading(false));
    }, [isReady, session]);

    const saveProfile = async () => {
        if (!session) return;
        setIsSavingProfile(true);

        try {
            const res = await apiPatch<{ data: HomeownerProfile }>(
                "/api/homeowners/profiles/mine",
                { phoneNumber },
                { token: session.token }
            );
            updateProfile(res.data);
            toast({ title: "Profile updated.", status: "success" });
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : "Something went wrong.";
            toast({ title: message, status: "error" });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const saveHome = async () => {
        if (!session || !profile) return;
        setIsSavingHome(true);

        const address = { street, city, state, postalCode, country: "Canada" };

        try {
            if (profile.home) {
                await apiPatch(
                    `/api/homeowners/profiles/mine/home/${profile.home._id}`,
                    { address, homeType },
                    { token: session.token }
                );
            } else {
                const res = await apiPost<{ data: HomeownerProfile["home"] }>(
                    "/api/homeowners/profiles/mine/home",
                    { address, homeType },
                    { token: session.token }
                );
                setProfile({ ...profile, home: res.data });
            }
            toast({ title: "Address saved.", status: "success" });
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : "Something went wrong.";
            toast({ title: message, status: "error" });
        } finally {
            setIsSavingHome(false);
        }
    };

    if (!isReady || isLoading || !profile) {
        return (
            <Center minH="100dvh">
                <Spinner size="lg" color="var(--season-primary)" />
            </Center>
        );
    }

    return (
        <>
            <Head>
                <title>My Account</title>
            </Head>
            <CustomerTopNav />
            <Box maxW="560px" mx="auto" px={[4, 6]} py={[6, 10]}>
                <Heading fontSize={["xl", "2xl"]} color="var(--season-primary)" mb={6}>
                    My Account
                </Heading>

                <VStack
                    align="stretch"
                    spacing={4}
                    border="1px solid"
                    borderColor="gray.100"
                    borderRadius="1rem"
                    p={5}
                    mb={6}
                >
                    <HStack justify="space-between">
                        <Text color="gray.500" fontSize="sm">
                            Name
                        </Text>
                        <Text fontWeight={600}>{profile.fullName}</Text>
                    </HStack>
                    <HStack justify="space-between">
                        <Text color="gray.500" fontSize="sm">
                            Email
                        </Text>
                        <Text fontWeight={600}>{profile.email}</Text>
                    </HStack>
                    <FormControl>
                        <FormLabel fontSize="sm">Phone number</FormLabel>
                        <Input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="(555) 123-4567"
                        />
                    </FormControl>
                    <PrimaryButton
                        alignSelf="flex-start"
                        isLoading={isSavingProfile}
                        onClick={saveProfile}
                    >
                        Save
                    </PrimaryButton>
                </VStack>

                <Heading fontSize="lg" mb={4}>
                    Home Address
                </Heading>
                <VStack
                    align="stretch"
                    spacing={4}
                    border="1px solid"
                    borderColor="gray.100"
                    borderRadius="1rem"
                    p={5}
                >
                    <FormControl>
                        <FormLabel fontSize="sm">Home type</FormLabel>
                        <Select
                            value={homeType}
                            onChange={(e) => setHomeType(e.target.value)}
                        >
                            {HOME_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel fontSize="sm">Street</FormLabel>
                        <Input value={street} onChange={(e) => setStreet(e.target.value)} />
                    </FormControl>
                    <HStack>
                        <FormControl>
                            <FormLabel fontSize="sm">City</FormLabel>
                            <Input value={city} onChange={(e) => setCity(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="sm">Province</FormLabel>
                            <Input value={state} onChange={(e) => setState(e.target.value)} />
                        </FormControl>
                    </HStack>
                    <FormControl>
                        <FormLabel fontSize="sm">Postal code</FormLabel>
                        <Input
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </FormControl>
                    <Divider />
                    <PrimaryButton
                        alignSelf="flex-start"
                        isLoading={isSavingHome}
                        onClick={saveHome}
                    >
                        Save address
                    </PrimaryButton>
                </VStack>
            </Box>
        </>
    );
};

export default Account;
