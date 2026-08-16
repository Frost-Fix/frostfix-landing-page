import { forwardRef } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

// The season-primary CTA button used across auth, the booking wizard, and
// the dashboards - was copy-pasted with the same bg/color/hover props in a
// dozen files. Centralized here so the hover/press feel is consistent and
// only needs to be tuned in one place.
const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
    (props, ref) => (
        <Button
            ref={ref}
            bg="var(--season-primary)"
            color="white"
            transition="transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease"
            _hover={{
                opacity: 0.94,
                transform: "translateY(-1px)",
                boxShadow: "0 6px 16px rgba(11, 37, 69, 0.18)",
            }}
            _active={{ opacity: 0.9, transform: "translateY(0)" }}
            {...props}
        />
    )
);

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;
