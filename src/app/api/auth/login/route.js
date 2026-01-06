import { NextResponse } from "next/server";
import axios from "@/config/axios";

export async function POST(req) {
  const { identifier, password } = await req.json();

  // Find user by email
  let res = await axios.get(`/users?email=${identifier}&password=${password}`);

  if (!res.data?.length) {
    // Find user by username
    res = await axios.get(`/users?username=${identifier}&password=${password}`);
  }

  if (!res.data?.length) {
    return NextResponse.json(
      { message: "Invalid Credentials!!", success: false },
      { status: 404 },
    );
  }

  const data = res.data[0];

  // To be passed as response & set cookie
  const user = {
    id: data.id,
    name: data.name,
    username: data.username,
    email: data.email,
  };

  const response = NextResponse.json({ user, success: true });

  response.cookies.set("user", JSON.stringify(user), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 30 * 60 * 60 * 24, // 30 days
  });

  return response;
}
