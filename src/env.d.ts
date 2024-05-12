/// <reference types="astro/client" />

type R2Bucket = import("@cloudflare/workers-types").R2Bucket;
type ENV = {
  DISCORD_WEBHOOK_URL: string;
  UPLOAD_PASSWORD: string;
  URL: string;
  BUCKET_URL: string;
  BUCKET_KEY_PREFIX: string;
  BUCKET: R2Bucket;
};

type Runtime = import("@astrojs/cloudflare").Runtime<ENV>;
declare namespace App {
  interface Locals extends Runtime {}
}
