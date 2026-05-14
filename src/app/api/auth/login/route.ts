import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "../../../../lib/firebaseAdmin";
import { connectDB } from "../../../../lib/mongodb";
import Usuario from "../../../../models/User";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const idToken = authHeader.split(" ")[1];
    const decoded = await auth.verifyIdToken(idToken);

    await connectDB();
    const usuario = await (Usuario as any).findOne({ uid: decoded.uid }).lean() as any;
    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const token = jwt.sign(
      { id: usuario._id, uid: usuario.uid, rol: usuario.rol },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const res = NextResponse.json({ ok: true });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
