import { createTheme } from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: "dark", // theme 
        primary: {
          main: "#7de51c", 
        },
        secondary: {
          main: "#888888", 
        },
        black: {
          main: "#242B2E",
        },
        background: {
          main: "#000000",
          default: "#999",
          paper: "#222222",
        },
        textColor: {
          main: "#111111",
        },
      },
    });
    export default darkTheme;
