import { randomId, sendDiscordWebhook } from "@/lib/utils";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
  const formData = await request.formData();

  const password = formData.get("password")?.toString();
  if (!password || password != locals.runtime.env.UPLOAD_PASSWORD) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid password" }),
      { status: 400 }
    );
  }

  const file = formData.get("file") as File;
  if (
    !file ||
    file.size === 0 ||
    !file.type ||
    !file.type.startsWith("image/") ||
    !file.name
  ) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid file" }),
      { status: 400 }
    );
  }

  const fileName = `${randomId(5)}.${file.type.split("/").pop()}`;
  const fileData = await file.arrayBuffer();

  try {
    const { BUCKET, DISCORD_WEBHOOK_URL, BUCKET_URL, URL, BUCKET_KEY_PREFIX } =
      locals.runtime.env;

    await BUCKET.put(
      `${locals.runtime.env.BUCKET_KEY_PREFIX}${fileName}`,
      fileData
    );
    locals.runtime.ctx.waitUntil(
      sendDiscordWebhook(
        fileName,
        DISCORD_WEBHOOK_URL,
        BUCKET_URL,
        URL,
        BUCKET_KEY_PREFIX
      )
    );
    return new Response(JSON.stringify({ success: true, fileName }));
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
};
