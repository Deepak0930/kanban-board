"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { fileToBase64 } from "@/utils/fileToBase64";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/config/axios";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import toast from "react-hot-toast";
import { sleep } from "@/utils/sleep";

export default function SignupPage() {
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const registerSchema = zod.object({
    name: zod.string().min(2, "Name is required"),
    username: zod.string().min(3, "Username must be at least 3 characters"),
    email: zod.string().email("Invalid email address"),
    contact: zod
      .string()
      .optional()
      .refine(
        (val) => val === undefined || /^\d{10}$/.test(val),
        "Contact number must be 10 digits",
      ),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    profilePic: zod.any().optional(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await sleep(1000);
      const user = await axios.get(
        `/users?username=${data.username}&email=${data.email}`,
      );

      if (user.data?.length) {
        toast.error("Username or email already exists");
        return;
      }

      let profilePic = "";

      if (data.profilePic?.[0]) {
        profilePic = await fileToBase64(data.profilePic[0]);
      }

      const payload = {
        name: data.name,
        username: data.username,
        email: data.email,
        contact: data.contact || "",
        password: data.password,
        profilePic,
      };
      await sleep(1000);
      await axios.post("/users", payload);
      toast.success("Registration successful! Please login.");
      router.push("/login");
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("profilePic", e.target.files);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Box width="100%" maxWidth={420}>
      <Typography variant="h5" textAlign="center" mb={3}>
        Create account
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Box textAlign="center">
            <Avatar src={preview} sx={{ width: 72, height: 72, mx: "auto" }} />
            <Button component="label" size="small">
              Upload photo
              <input
                hidden
                disabled={isSubmitting}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          <TextField
            label="Name"
            {...register("name")}
            disabled={isSubmitting}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Username"
            {...register("username")}
            disabled={isSubmitting}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            label="Email"
            {...register("email")}
            disabled={isSubmitting}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Contact No."
            type="number"
            {...register("contact")}
            disabled={isSubmitting}
            error={!!errors.contact}
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                pattern: "[0-9]*",
              },
            }}
            helperText={errors.contact?.message}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            disabled={isSubmitting}
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            size="large"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Please wait..." : "Register"}
          </Button>
        </Stack>
      </form>

      <Typography
        variant="body"
        as="div"
        color="text.secondary"
        textAlign="center"
        mt={2}
      >
        Already have an account?{" "}
        <Link href="/login" className="underline-offset-3 hover:underline">
          Login
        </Link>
      </Typography>
    </Box>
  );
}
