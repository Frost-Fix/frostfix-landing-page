import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Center, Spinner, SimpleGrid, Heading, VStack } from "@chakra-ui/react";
import { useRequireRole } from "@/lib/useRequireRole";
import { apiGet } from "@/lib/api";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/admin/StatCard";
import SeasonSwitcher from "@/components/admin/SeasonSwitcher";
import { Season } from "@/types/booking";

const NAV_ITEMS = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/services", label: "Services" },
];

interface DashboardStats {
    countsByStatus: Record<string, number>;
    todayCount: number;
    activeContractors: number;
    revenueEstimate: number;
}

const AdminDashboard: NextPage = () => {
    const { session, isReady } = useRequireRole("admin");
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activeSeason, setActiveSeason] = useState<Season>("WINTER");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isReady || !session) return;

        Promise.all([
            apiGet<{ data: DashboardStats }>("/api/admin/dashboard", {
                token: session.token,
            }),
            apiGet<{ data: { activeSeason: Season } }>("/api/admin/settings", {
                token: session.token,
            }),
        ])
            .then(([dashboardRes, settingsRes]) => {
                setStats(dashboardRes.data);
                setActiveSeason(settingsRes.data.activeSeason);
            })
            .finally(() => setIsLoading(false));
    }, [isReady, session]);

    if (!isReady || isLoading || !stats) {
        return (
            <Center minH="100dvh">
                <Spinner size="lg" color="var(--season-primary)" />
            </Center>
        );
    }

    return (
        <>
            <Head>
                <title>Admin Dashboard</title>
            </Head>
            <DashboardShell
                title="FrostFix Admin"
                navItems={NAV_ITEMS}
                loginPath="/admin/login"
            >
                <Heading fontSize={["xl", "2xl"]} color="var(--season-primary)" mb={6}>
                    Dashboard
                </Heading>

                <VStack align="stretch" spacing={6}>
                    <SimpleGrid columns={[2, 4]} spacing={4}>
                        <StatCard
                            label="Pending Assignment"
                            value={stats.countsByStatus.PENDING_ASSIGNMENT || 0}
                            emoji="🕐"
                        />
                        <StatCard
                            label="Scheduled Today"
                            value={stats.todayCount}
                            emoji="📅"
                        />
                        <StatCard
                            label="Available Contractors"
                            value={stats.activeContractors}
                            emoji="🧰"
                        />
                        <StatCard
                            label="Revenue (Completed)"
                            value={`$${stats.revenueEstimate}`}
                            emoji="💰"
                        />
                    </SimpleGrid>

                    <SeasonSwitcher
                        token={session!.token}
                        activeSeason={activeSeason}
                        onChange={setActiveSeason}
                    />
                </VStack>
            </DashboardShell>
        </>
    );
};

export default AdminDashboard;
