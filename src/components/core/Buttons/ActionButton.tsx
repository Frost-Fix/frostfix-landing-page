import Link from "next/link"; // Import Next.js Link
import { FC } from "react";
import { Button, Flex } from "@chakra-ui/react";

const ActionButton: FC = () => {
    return (
        <Flex>
            <Link href="/booking/new" passHref>
                {" "}
                {/* Link to the in-house booking flow */}
                <Button
                    fontSize={"0.9rem"}
                    backgroundColor={"#0B2545"} // Original background color
                    color={"white"}
                    px={5}
                    paddingTop={"1.5rem"}
                    paddingBottom={"1.5rem"}
                    paddingLeft={"1.9rem"}
                    paddingRight={"1.9rem"}
                    borderRadius={"0.8rem"}
                    _hover={{
                        backgroundColor: "#123a6b", // Lighter shade on hover
                        transform: "scale(1.05)", // Slightly enlarge the button
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Add a soft shadow
                    }}
                    transition="all 0.3s ease" // Smooth transition for hover effects
                >
                    Book Now
                </Button>
            </Link>
        </Flex>
    );
};

export default ActionButton;
