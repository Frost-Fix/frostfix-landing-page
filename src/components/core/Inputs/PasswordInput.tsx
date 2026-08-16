import { forwardRef, useState } from "react";
import {
    Input,
    InputGroup,
    InputProps,
    InputRightElement,
    IconButton,
} from "@chakra-ui/react";

// Every password field in the app (signup, login, reset) was a plain
// type="password" input with no way to check what you typed - easy to
// mistype ~8 characters of special-character requirements blind. This adds
// a standard show/hide toggle without changing how each page manages state.
const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
    (props, ref) => {
        const [isVisible, setIsVisible] = useState(false);

        return (
            <InputGroup size={props.size}>
                <Input
                    ref={ref}
                    type={isVisible ? "text" : "password"}
                    {...props}
                />
                <InputRightElement h="100%">
                    <IconButton
                        aria-label={isVisible ? "Hide password" : "Show password"}
                        icon={<>{isVisible ? "🙈" : "👁️"}</>}
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsVisible((v) => !v)}
                        tabIndex={-1}
                    />
                </InputRightElement>
            </InputGroup>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
