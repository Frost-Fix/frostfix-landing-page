import Link from "next/link"; // Import the Link component from Next.js
import { FC } from "react";
import {
    Box,
    Center,
    Grid,
    GridItem,
    Heading,
    Text,
    Button,
    Flex,
    Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import SeasonPill from "@/components/booking/SeasonPill";

// Motion elements from framer-motion
const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);
const MotionImage = motion(Image);

const Hero: FC = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, x: -100 }, // Initial state: faded and slid to the left
        visible: { opacity: 1, x: 0, transition: { duration: 1 } }, // Final state: full opacity, normal position
    };

    return (
        <MotionBox
            mb={-0.5}
            minH={"auto"} // Adjusted minimum height for the hero section
            pt={[8, 5]} // Padding for mobile and desktop
            position="relative"
            bgColor={"#FFFFFF"} // Solid white background
            bgImage="url('/images/snow.png')" // Add snow background image
            bgSize="cover" // Make the background cover the entire area
            bgPosition="unset" // Center the background image
            // initial="hidden"
            animate="visible"
            variants={containerVariants} // Apply the animation variants
        >
            <Grid
                templateColumns={{
                    base: "1fr", // Single column for mobile
                    md: "1fr", // Single column for tablet
                    lg: "1fr", // Single column for desktop
                }}
                gap={6} // Gap between grid items
                alignItems="center"
            >
                {/* Left section: Heading, Text, and Waitlist Button */}
                <GridItem colSpan={1}>
                    <Center
                        textAlign={"center"}
                        flexDirection={"column"}
                        px={[4, 8]}
                    >
                        <Box mb={4}>
                            <SeasonPill />
                        </Box>

                        {/* Animated Heading */}
                        <MotionHeading
                            fontSize={["3xl", "5xl", "7xl"]}
                            color={"black"}
                            mb={4}
                            mt={120}
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }} // Delay to make it smoother
                        >
                            Horai App
                        </MotionHeading>

                        {/* Animated Text */}
                        <MotionText
                            my={2}
                            maxW={"500px"}
                            color={"#000E1B80"}
                            fontSize={["sm", "md", "lg"]}
                            mx="auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }} // Delayed to sync with heading
                        >
                            Book a service online. Pay a flat rate and
                            enjoy top-of-the-line customer service.
                        </MotionText>

                        {/* Link to the in-house booking flow */}
                        <Flex justifyContent="center" mt={6}>
                            <MotionButton
                                as={Link}
                                href="/booking/new"
                                fontSize={"0.9rem"}
                                backgroundColor={"#0B2545"} // Original background color
                                color={"white"}
                                px={5}
                                borderRadius={"0.8rem"}
                                paddingTop={"1.7rem"}
                                paddingBottom={"1.7rem"}
                                paddingLeft={"2rem"}
                                paddingRight={"2rem"}
                                _hover={{
                                    backgroundColor: "#123a6b", // Lighter shade on hover
                                    transform: "scale(1.05)", // Slightly enlarge the button
                                    boxShadow:
                                        "0 4px 12px rgba(0, 0, 0, 0.2)", // Add a soft shadow
                                }}
                                sx={{ transition: "all 0.3s ease" }} // motion()'s own `transition` prop is for animation config, not CSS - set the hover transition via sx instead
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                Book Now
                            </MotionButton>
                        </Flex>

                        {/* Animated Phone Image */}
                        <Center mt={10}>
                            <MotionImage
                                src="/images/iPhone15.png" // Use the new image
                                w={["100%", "400px", "500px"]} // Adjust width for responsiveness
                                initial={{ opacity: 0, x: 100 }} // Start off to the right and faded
                                animate={{ opacity: 1, x: 0 }} // Move into view and fade in
                                transition={{ delay: 2, duration: 1 }} // Delayed the longest
                            />
                        </Center>
                    </Center>
                </GridItem>
            </Grid>
        </MotionBox>
    );
};

export default Hero;
