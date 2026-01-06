"use client";

import { Box, Typography, Grid, Paper } from "@mui/material";
import { useEffect } from "react";
import { useBoardStore } from "@/store/board-store";

export default function DashboardPage() {
  const { tasks, fetchTasks } = useBoardStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const total = tasks?.length;
  const completed = tasks?.filter((t) => t.stage === 3).length;
  const pending = tasks?.filter((t) => t.stage !== 3).length;

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Overview
      </Typography>

      <Grid container spacing={2}>
        <StatCard title="Total Tasks" value={total} />
        <StatCard title="Completed" value={completed} />
        <StatCard title="Pending" value={pending} />
      </Grid>
    </Box>
  );
}

function StatCard({ title, value }) {
  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, textAlign: "center" }}>
        <Typography variant="h6" fontWeight={500} color="text.secondary" mb={1.5}>
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
      </Paper>
    </Grid>
  );
}
