export type Season = "WINTER" | "SPRING" | "SUMMER" | "FALL";
export type ServiceSeason = Season | "ALL_SEASON";

export type ServiceIcon =
    | "snowflake"
    | "leaf"
    | "sun"
    | "droplet"
    | "home"
    | "tool";

export interface Service {
    _id: string;
    name: string;
    slug: string;
    description: string;
    season: ServiceSeason;
    icon: ServiceIcon;
    unit: "PER_VISIT" | "PER_HOUR" | "PER_SQFT";
    basePrice: number;
    isActive: boolean;
}

export type TimeSlot = "MORNING" | "MIDDAY" | "AFTERNOON" | "EVENING";

export interface SlotAvailability {
    slot: TimeSlot;
    label: string;
    available: boolean;
    remaining: number;
}

export type BookingStatus =
    | "PENDING_ASSIGNMENT"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

export type PaymentMethod = "CASH" | "E_TRANSFER" | "CARD_ON_FILE";

export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
}

export interface StatusHistoryEntry {
    status: BookingStatus;
    changedAt: string;
    note?: string;
}

export interface ContactInfo {
    _id: string;
    fullName: string;
    phoneNumber?: string;
    email?: string;
}

export interface Booking {
    _id: string;
    homeowner: ContactInfo | string;
    contractor: ContactInfo | string | null;
    service: Service;
    address: Address;
    contactPhone: string;
    scheduledDate: string;
    timeSlot: TimeSlot;
    status: BookingStatus;
    paymentMethod: PaymentMethod;
    estimatedPrice: number;
    notes?: string;
    cancellationReason?: string;
    statusHistory: StatusHistoryEntry[];
    createdAt: string;
}
