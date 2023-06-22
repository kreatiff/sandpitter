import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#01B1AF",
      contrastText: "#fff", // Set text color to white
    },
    secondary: {
      main: "#19857b",
      contrastText: "#fff", // Set text color to white
    },
    error: {
      main: "#ff0000",
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
