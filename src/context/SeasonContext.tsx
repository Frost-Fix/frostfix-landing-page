import {
    createContext,
    useContext,
    useEffect,
    useState,
    FC,
    ReactNode,
} from "react";
import { apiGet } from "@/lib/api";
import { Season } from "@/types/booking";

interface SeasonContextValue {
    season: Season;
    isLoading: boolean;
}

const SeasonContext = createContext<SeasonContextValue>({
    season: "WINTER",
    isLoading: true,
});

const POLL_INTERVAL_MS = 60_000;

export const SeasonProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [season, setSeason] = useState<Season>("WINTER");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchSeason = async () => {
            try {
                const res = await apiGet<{ data: { activeSeason: Season } }>(
                    "/api/settings/season"
                );
                if (!cancelled) {
                    setSeason(res.data.activeSeason);
                }
            } catch (err) {
                console.error("Failed to fetch active season", err);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchSeason();
        const interval = setInterval(fetchSeason, POLL_INTERVAL_MS);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        document.documentElement.dataset.season = season.toLowerCase();
    }, [season]);

    return (
        <SeasonContext.Provider value={{ season, isLoading }}>
            {children}
        </SeasonContext.Provider>
    );
};

export const useSeason = () => useContext(SeasonContext);
