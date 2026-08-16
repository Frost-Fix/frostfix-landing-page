import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// This app has no designed dark mode anywhere (the marketing site hardcodes
// light colors, the booking/dashboard UI is built against a light palette),
// so color mode is pinned to light regardless of OS/browser preference.
// `extendBaseTheme` was used previously, which starts from Chakra's stripped
// "base" theme with no default component styles (Input, Button, Menu, Modal,
// Table, Tabs, ...) - most of the booking/admin/contractor UI relies on
// Chakra's built-in component styling, so `extendTheme` (the full default
// theme) is required for those to render correctly at all.
const config: ThemeConfig = {
    initialColorMode: "light",
    useSystemColorMode: false,
};

const theme = extendTheme({
    config,
    // Body-level color/background is already owned by globals.css (the
    // `html, body` rule) - not duplicated here to avoid two stylesheets
    // fighting over the same rule at equal specificity.
    fonts: {
        heading: `"SF Pro", "Georama", sans-serif`,
        body: `"SF Pro", "Georama", sans-serif`,
    },
});

export default theme;
