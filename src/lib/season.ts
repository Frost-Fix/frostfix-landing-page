import { Season, ServiceIcon, ServiceSeason, TimeSlot } from "@/types/booking";

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

// The backend only ever stores/returns the enum key (e.g. "MORNING") - the
// human label ("8:00 AM - 11:00 AM") only exists in the availability
// response at booking time, so any screen rendering a saved booking's
// timeSlot needs this mapping rather than printing the raw enum.
export const TIME_SLOT_LABEL: Record<TimeSlot, string> = {
    MORNING: "8:00 AM - 11:00 AM",
    MIDDAY: "11:00 AM - 2:00 PM",
    AFTERNOON: "2:00 PM - 5:00 PM",
    EVENING: "5:00 PM - 8:00 PM",
};
