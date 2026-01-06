"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { z as zod } from "zod";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import toast from "react-hot-toast";
import { sleep } from "@/utils/sleep";
import ClientCaptcha from "react-client-captcha";
import "react-client-captcha/dist/index.css";

export default function LoginPage() {
  const captchaRef = useRef();
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");

  const loginSchema = zod.object({
    identifier: zod.string().min(1, "Required Field"),
    password: zod.string().min(1, "Password is required"),
    captcha: zod.string().min(1, "Captcha is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      if (data.captcha !== captchaCode) {
        toast.error("Invalid Captcha");
        captchaRef.current.generateCaptcha();
        return;
      }
      await sleep(2000);
      await login(data.identifier, data.password);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error?.message || "Login failed. Please check your credentials.",
      );
    }
  };

  return (
    <Box width="100%" maxWidth={420}>
      <Typography variant="h5" textAlign={"center"} mb={3}>
        Sign in
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Email or Username"
            {...register("identifier")}
            disabled={isSubmitting}
            error={!!errors.identifier}
            helperText={errors.identifier?.message}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            autoComplete="off"
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

          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              label="Captcha"
              {...register("captcha")}
              disabled={isSubmitting}
              error={!!errors.captcha}
              helperText={errors.captcha?.message}
            />

            <ClientCaptcha
              containerClassName="captcha-container"
              captchaCode={(captcha) => setCaptchaCode(captcha)}
              width={130}
              height={50}
              charsCount={6}
              ref={captchaRef}
              fontFamily={"Inter"}
            />
          </Box>

          <Button
            type="submit"
            size="large"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Please wait..." : "Login"}
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
        Not have an account?{" "}
        <Link href="/register" className="underline-offset-3 hover:underline">
          Register
        </Link>
      </Typography>
    </Box>
  );
}
