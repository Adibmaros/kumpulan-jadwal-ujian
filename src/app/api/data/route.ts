import { NextResponse, NextRequest } from "next/server";
import { dataUjian } from "@/constants/data-ujian";

export function GET() {
  return NextResponse.json(dataUjian);
}
