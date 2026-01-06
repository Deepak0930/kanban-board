import { NextResponse } from "next/server";
import axios from "@/config/axios";

export async function POST(req) {
  const { identifier, password } = await req.json();

  let res = await axios.get(`/users?email=${identifier}&password=${password}`);

  if (!res.data?.length) {
    res = await axios.get(`/users?username=${identifier}&password=${password}`);
  }

  if (!res.data?.length) {
    return NextResponse.json(
      { message: "Invalid Credentials!!", success: false },
      { status: 404 },
    );
  }

  const user = res.data[0];
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
