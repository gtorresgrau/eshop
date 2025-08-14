import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { uid, email, role } = await req.json(); // Traelo de Firebase verificado en server si corresponde
  const token = jwt.sign({ uid, email, role }, process.env.JWT_SECRET!, { expiresIn: "7d" });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
