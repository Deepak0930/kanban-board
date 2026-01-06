import { useDroppable } from "@dnd-kit/core";
import { Box, Typography, Paper, Chip } from "@mui/material";

export function Column({ stage, title, count, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${stage}`,
    data: { stage, type: "COLUMN" },
  });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        p: 2,
        minHeight: 420,
        bgcolor: isOver ? "#f0f7ff" : "#fff",
        transition: "0.2s",
        borderRadius: 2,
      }}
      className="ring-1! ring-gray-200"
      elevation={0}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography fontWeight={500}>{title}</Typography>
        <Chip size="small" label={count} />
      </Box>
      {children}
    </Paper>
  );
}
