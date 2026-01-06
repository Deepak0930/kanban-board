import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Tooltip,
  Stack,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDate } from "@/utils/format-date";

export function TaskCard({ task, onMove, onEdit, onDelete }) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: task.id,
      activationConstraint: { distance: 5 },
    });

  return (
    <Paper
      ref={setNodeRef}
      {...attributes}
      sx={{
        p: 1.5,
        mb: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        borderRadius: 2,
        transform: CSS.Transform.toString(transform),
        transition,
        // "&:hover": { boxShadow: 3 },
      }}
      className="ring-1! ring-gray-300"
    >
      <Box display="flex" gap={1} alignItems="">
        <Box {...listeners} sx={{ cursor: "grab" }}>
          <DragIndicatorIcon />
        </Box>
        <Stack sx={{ flex: 1, gap: 0.5 }}>
          <Typography fontWeight={500}>{task.name}</Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textTransform: "capitalize" }}
          >
            {task.priority} • {formatDate(task.deadline)}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        <Tooltip title="Move Back">
          <span>
            <IconButton
              size="small"
              disabled={task.stage === 0}
              onClick={(e) => {
                e.stopPropagation();
                onMove(task, -1);
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Move Forward">
          <span>
            <IconButton
              size="small"
              disabled={task.stage === 3}
              onClick={(e) => {
                e.stopPropagation();
                onMove(task, 1);
              }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Edit Task">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Task">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}
