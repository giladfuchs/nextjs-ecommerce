import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",

  palette: {
    primary: {
      main: "#24bfa7",
    },
    background: {
      default: "#f4f9f8",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#fff",
            "& fieldset": {
              borderColor: "#ddd",
            },
            "&:hover fieldset": {
              borderColor: "#aaa",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#24bfa7",
              borderWidth: 1,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          boxShadow: "none",
          border: "1px solid #ddd",
          "&:hover": {
            borderColor: "#aaa",
            backgroundColor: "#f9f9f9",
          },
        },
      },
    },
  },
});

export default theme;
