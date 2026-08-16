import { FC } from "react";
import { Badge } from "@chakra-ui/react";
import { BookingStatus } from "@/types/booking";

const STATUS_STYLE: Record<
    BookingStatus,
    { label: string; colorScheme: string }
> = {
    PENDING_ASSIGNMENT: { label: "Finding a contractor", colorScheme: "yellow" },
    ASSIGNED: { label: "Assigned", colorScheme: "blue" },
    IN_PROGRESS: { label: "In Progress", colorScheme: "purple" },
    COMPLETED: { label: "Completed", colorScheme: "green" },
    CANCELLED: { label: "Cancelled", colorScheme: "red" },
};

const BookingStatusBadge: FC<{ status: BookingStatus }> = ({ status }) => {
    const { label, colorScheme } = STATUS_STYLE[status];

    return (
        <Badge colorScheme={colorScheme} borderRadius="full" px={3} py={1}>
            {label}
        </Badge>
    );
};

export default BookingStatusBadge;
