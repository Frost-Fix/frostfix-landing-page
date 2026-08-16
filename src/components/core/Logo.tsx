import NextLink from "next/link";
import { FC } from "react";
import { Image } from "@chakra-ui/react";

interface LogoProps {
    size?: string;
}

const Logo: FC<LogoProps> = ({ size = "150px" }) => {
    return (
        <NextLink href={`/#`} passHref>
            <Image
                src="/images/horai_logo.svg" // Make sure this is the correct path
                alt="Horai Logo"
                boxSize={size}
                objectFit="contain"
            />
        </NextLink>
    );
};

export default Logo;
