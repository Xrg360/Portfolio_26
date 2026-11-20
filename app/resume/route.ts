import { site } from "@/content/site";

export const dynamic = "force-static";

export function GET() {
  return new Response(null, { status: 307, headers: { Location: site.resumeFile } });
}
