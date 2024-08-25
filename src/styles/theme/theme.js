import { extendTheme, theme as base } from "@chakra-ui/react";
import {  MultiSelectTheme } from 'chakra-multiselect'

const theme = extendTheme({
  colors: {
    lime: "#028797",
  },

  fonts: {
    heading: `Poppins, ${base.fonts.heading}`,
    body: `Poppins, ${base.fonts.body}`,
  },

  styles: {
    global: {
      body: {
        bg: "#FFFFFF",
        color: "#232323",
      },
      "*": {
        lineHeight: "1.2",
      },
    },
  },

  components: {
    Checkbox: {
      baseStyle: {
        label: {
          pointerEvents: "none",
        },
      },
    },
    MultiSelect: MultiSelectTheme
  },

  fontWeights: {
    extraThin: 100,
    thin: 200,
    extraLight: 300,
    light: 400,
    normal: 500,
    medium: 600,
    bold: 700,
    extraBold: 800,
  },
});

export default theme;
