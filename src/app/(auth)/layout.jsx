import { Box, Typography } from "@mui/material";

export default function AuthLayout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Left Section */}
      <Box
        flex={1}
        display={{ xs: "none", md: "flex" }}
        alignItems="center"
        justifyContent="center"
        bgcolor="#f5f7fa"
        p={4}
      >
        <Box maxWidth={400} textAlign={"center"}>
          <Typography variant="h4" gutterBottom>
            Welcome to Kanban App
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize your tasks efficiently and stay productive with a simple
            kanban workflow.
          </Typography>
        </Box>
      </Box>

      {/* Right Section */}
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        {children}
      </Box>
    </Box>
  );
}
