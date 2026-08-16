import { Season, ServiceIcon, ServiceSeason } from "@/types/booking";

export const SEASONS: Season[] = ["WINTER", "SPRING", "SUMMER", "FALL"];

export const SEASON_META: Record<
    Season,
    { label: string; emoji: string; primary: string; secondary: string }
> = {
    WINTER: {
        label: "Winter",
        emoji: "❄️",
        primary: "#0B2545",
        secondary: "#4C9AFF",
    },
    SPRING: {
        label: "Spring",
        emoji: "🌱",
        primary: "#22543D",
        secondary: "#68D391",
    },
    SUMMER: {
        label: "Summer",
        emoji: "☀️",
        primary: "#7B341E",
        secondary: "#F6AD55",
    },
    FALL: {
        label: "Fall",
        emoji: "🍂",
        primary: "#7B3410",
        secondary: "#DD6B20",
    },
};

export const serviceSeasonLabel = (season: ServiceSeason) =>
    season === "ALL_SEASON" ? "Year-Round" : SEASON_META[season].label;

export const ICON_EMOJI: Record<ServiceIcon, string> = {
    snowflake: "❄️",
    leaf: "🍃",
    sun: "☀️",
    droplet: "💧",
    home: "🏠",
    tool: "🛠️",
};
