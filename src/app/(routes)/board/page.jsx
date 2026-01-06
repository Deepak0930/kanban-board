"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import toast from "react-hot-toast";
import { TaskCard } from "@/components/kanban/task-card";
import { Column } from "@/components/kanban/column";
import { useBoardStore } from "@/store/board-store";

const STAGES = ["Backlog", "To Do", "Ongoing", "Done"];

const priorityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function KanbanPage() {
  const {
    isLoading,
    tasks,
    fetchTasks,
    addTask,
    moveTask,
    removeTask,
    updateTask,
  } = useBoardStore();

  const [activeTask, setActiveTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);

  // Sensors to support touch devices & keyboard
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [form, setForm] = useState({
    name: "",
    priority: "",
    deadline: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    try {
      if (!form.name || !form.priority || !form.deadline) {
        toast.error("All fields are required");
        return;
      }

      await addTask({ ...form, stage: 0 });
      toast.success("Task created successfully");
      setForm({ name: "", priority: "", deadline: "" });
      fetchTasks();
    } catch (error) {
      toast.error(error?.messsage || "Failed to create task");
    }
  };

  // Get task data on drag start
  const handleDragStart = ({ active }) => {
    let task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  // Handle move task on drag end
  const handleDragEnd = async ({ active, over }) => {
    try {
      setActiveTask(null);
      if (!over) return;

      const task = tasks.find((t) => t.id === active.id);
      if (!task) return;

      // Delete task if dropped in trash
      if (over.id === "TRASH") {
        setDeleteTask(task);
        return;
      }

      let newStage = null;
      // Get new stage if dropped on column
      if (over.data?.current?.type === "COLUMN") {
        newStage = over.data.current.stage;
      } else {
        // Get new stage if dropped on another task
        const targetTask = tasks.find((t) => t.id === over.id);
        if (targetTask) newStage = targetTask.stage;
      }

      // No change if dropped in same stage
      if (newStage === null || newStage === task.stage) return;

      // API call to move task
      await moveTask(task.id, newStage);
      toast.success("Task moved successfully");
    } catch (error) {
      toast.error(error?.messsage || "Failed to move task");
    }
  };

  const handleMoveTask = async (task, dir) => {
    try {
      // Get new stage based on direction
      const newStage = task.stage + dir;
      if (newStage < 0 || newStage > 3) return;

      await moveTask(task.id, newStage);
      toast.success("Task moved successfully");
    } catch (error) {
      toast.error(error?.messsage || "Failed to move task");
    }
  };

  const saveEdit = async () => {
    try {
      await updateTask(editTask);
      toast.success("Task updated successfully");
      setEditTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(error?.messsage || "Failed to save changes");
    }
  };

  const confirmDelete = async () => {
    try {
      await removeTask(deleteTask.id);
      toast.success("Task deleted successfully");
      setDeleteTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(error?.messsage || "Failed to delete task");
    }
  };

  // Create task form
  const renderCreateTask = () => (
    <Paper
      sx={{ p: 3, mb: 2, borderRadius: 2 }}
      className="ring-1! ring-gray-200"
      elevation={0}
    >
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
        <TextField
          label="Task name"
          value={form.name}
          sx={{ flexBasis: { xs: "100%", md: "auto" } }}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          size="small"
        />
        <Select
          value={form.priority}
          displayEmpty
          size="small"
          sx={{ minWidth: 120, flex: 1 }}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <MenuItem value="" disabled>
            Select Priority
          </MenuItem>
          {priorityOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <TextField
          type="date"
          size="small"
          value={form.deadline}
          sx={{ minWidth: 120, flex: 1 }}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />
        <Button
          sx={{ height: 40 }}
          variant="contained"
          onClick={handleCreateTask}
        >
          + Add Task
        </Button>
      </Box>
    </Paper>
  );

  // Edit task dialog
  const renderEditDialog = () => (
    <Dialog open={!!editTask} onClose={() => setEditTask(null)}>
      <DialogTitle fontWeight={500}>Edit Task</DialogTitle>
      {editTask && (
        <DialogContent
          sx={{
            display: "flex",
            gap: 2,
            pt: "8px !important",
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Task name"
            value={editTask.name}
            disabled={isLoading}
            sx={{ flexBasis: "100%" }}
            onChange={(e) => setEditTask({ ...editTask, name: e.target.value })}
          />
          <Select
            value={editTask.priority}
            disabled={isLoading}
            sx={{ flex: 1 }}
            onChange={(e) =>
              setEditTask({ ...editTask, priority: e.target.value })
            }
          >
            <MenuItem value="" disabled>
              Select Priority
            </MenuItem>
            {priorityOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <TextField
            type="date"
            disabled={isLoading}
            sx={{ flex: 1 }}
            value={editTask.deadline}
            onChange={(e) =>
              setEditTask({ ...editTask, deadline: e.target.value })
            }
          />
        </DialogContent>
      )}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => setEditTask(null)} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={saveEdit} disabled={isLoading}>
          {isLoading ? "Please wait..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Delete task confirmation dialog
  const renderDeleteDialog = () => (
    <Dialog open={!!deleteTask} onClose={() => setDeleteTask(null)}>
      <DialogTitle>Delete task?</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">
          Do you want to delete the task "{deleteTask?.name}"? This action
          cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => setDeleteTask(null)} disabled={isLoading}>
          Cancel
        </Button>
        <Button color="error" onClick={confirmDelete} disabled={isLoading}>
          {isLoading ? "Please wait..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Kanban Board
      </Typography>

      {renderCreateTask()}

      <Divider sx={{ mb: 2 }} />

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={2}
        >
          {STAGES.map((title, stageIndex) => (
            <Column
              key={stageIndex}
              stage={stageIndex}
              title={title}
              count={tasks.filter((t) => t.stage === stageIndex).length}
            >
              <SortableContext
                items={tasks
                  .filter((t) => t.stage === stageIndex)
                  .map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {tasks
                  .filter((t) => t.stage === stageIndex)
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onMove={handleMoveTask}
                      onEdit={setEditTask}
                      onDelete={setDeleteTask}
                    />
                  ))}
              </SortableContext>
            </Column>
          ))}
        </Box>

        {/* Indicator for the task currently being dragged */}
        <DragOverlay>
          {activeTask && (
            <Paper sx={{ p: 1.5, width: 220, boxShadow: 4 }}>
              <Typography fontWeight={500}>{activeTask.name}</Typography>
            </Paper>
          )}
        </DragOverlay>

        {/* Trash */}
        <TrashDropZone active={!!activeTask} />
      </DndContext>

      {renderEditDialog()}
      {renderDeleteDialog()}
    </Box>
  );
}

function TrashDropZone({ active }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "TRASH",
  });

  if (!active) return null;

  return (
    <Box
      ref={setNodeRef}
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 70,
        height: 70,
        borderRadius: "50%",
        backgroundColor: isOver ? "#ffebee" : "#f5f5f5",
        border: "2px solid rgba(255, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
    >
      <DeleteForeverIcon
        fontSize="medium"
        sx={{ color: "rgba(255, 0, 0, 0.7)" }}
      />
    </Box>
  );
}
