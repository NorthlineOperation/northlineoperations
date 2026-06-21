import { readFile } from "node:fs/promises";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

const TABLE = "cms_landing_pages";
const SLUG = "home";
const MEDIA_FOLDER = "landing-page";
const force = process.argv.includes("--force");

await loadDotEnv();

const supabaseUrl = readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
const bucket = process.env.SUPABASE_STORAGE_BUCKET || "cms-files";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const defaultProjects = [
  {
    id: "commercial-turnover",
    title: "Commercial Turnover",
    category: "Commercial Construction",
    location: "Columbus, Ohio",
    summary:
      "Final cleaning and turnover support for a commercial construction project.",
  },
  {
    id: "office-facility",
    title: "Office Facility Refresh",
    category: "Office Facilities",
    location: "Dublin, Ohio",
    summary:
      "Detailed janitorial and presentation cleaning for an active office facility.",
  },
  {
    id: "apartment-turnover",
    title: "Apartment Turnover",
    category: "Apartment Communities",
    location: "Westerville, Ohio",
    summary:
      "Move-out cleaning and readiness support for a managed apartment unit.",
  },
  {
    id: "site-support",
    title: "Jobsite Support",
    category: "Site Support",
    location: "Central Ohio",
    summary:
      "Jobsite cleanup and organization support to keep the work area moving.",
  },
];

const assetDefinitions = [
  {
    key: "hero",
    localPath: "src/assets/hero.jpg",
    storagePath: `${MEDIA_FOLDER}/hero.jpg`,
    alt: "Commercial building lobby",
  },
  {
    key: "about",
    localPath: "src/assets/about-van.jpeg",
    storagePath: `${MEDIA_FOLDER}/about-van.jpeg`,
    alt: "Northline service van",
  },
  {
    key: "servicePost",
    localPath: "src/assets/service-post.jpg",
    storagePath: `${MEDIA_FOLDER}/service-post.jpg`,
    alt: "Post-construction cleaning service",
  },
  {
    key: "serviceJanitor",
    localPath: "src/assets/service-janitor.jpg",
    storagePath: `${MEDIA_FOLDER}/service-janitor.jpg`,
    alt: "Janitorial service",
  },
  {
    key: "serviceMoveout",
    localPath: "src/assets/service-moveout.jpg",
    storagePath: `${MEDIA_FOLDER}/service-moveout.jpg`,
    alt: "Move-out cleaning service",
  },
  {
    key: "serviceSite",
    localPath: "src/assets/service-site.jpg",
    storagePath: `${MEDIA_FOLDER}/service-site.jpg`,
    alt: "Site support service",
  },
  {
    key: "project1Before",
    localPath: "src/assets/project-2.jpg",
    storagePath: `${MEDIA_FOLDER}/project-commercial-turnover-before.jpg`,
    alt: "Commercial turnover before service",
  },
  {
    key: "project1After",
    localPath: "src/assets/project-1.jpg",
    storagePath: `${MEDIA_FOLDER}/project-commercial-turnover-after.jpg`,
    alt: "Commercial turnover after service",
  },
  {
    key: "project2Before",
    localPath: "src/assets/project-3.jpg",
    storagePath: `${MEDIA_FOLDER}/project-office-facility-before.jpg`,
    alt: "Office facility before service",
  },
  {
    key: "project2After",
    localPath: "src/assets/project-2.jpg",
    storagePath: `${MEDIA_FOLDER}/project-office-facility-after.jpg`,
    alt: "Office facility after service",
  },
  {
    key: "project3Before",
    localPath: "src/assets/project-4.jpg",
    storagePath: `${MEDIA_FOLDER}/project-apartment-turnover-before.jpg`,
    alt: "Apartment turnover before service",
  },
  {
    key: "project3After",
    localPath: "src/assets/project-3.jpg",
    storagePath: `${MEDIA_FOLDER}/project-apartment-turnover-after.jpg`,
    alt: "Apartment turnover after service",
  },
  {
    key: "project4Before",
    localPath: "src/assets/project-1.jpg",
    storagePath: `${MEDIA_FOLDER}/project-site-support-before.jpg`,
    alt: "Jobsite support before service",
  },
  {
    key: "project4After",
    localPath: "src/assets/project-4.jpg",
    storagePath: `${MEDIA_FOLDER}/project-site-support-after.jpg`,
    alt: "Jobsite support after service",
  },
];

const serviceAssetByImageKey = {
  post: "servicePost",
  janitor: "serviceJanitor",
  moveout: "serviceMoveout",
  site: "serviceSite",
};

async function main() {
  const assets = Object.fromEntries(
    await Promise.all(
      assetDefinitions.map(async (definition) => [
        definition.key,
        await uploadAsset(definition),
      ]),
    ),
  );

  const { data, error } = await supabase
    .from(TABLE)
    .select("slug, content")
    .eq("slug", SLUG)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.content) {
    throw new Error(
      `No ${TABLE}.${SLUG} content row found. Save the landing page once in the admin CMS, then rerun this script.`,
    );
  }

  const content = structuredClone(data.content);
  applyImage(content.hero, "image", assets.hero);
  applyImage(content.about, "image", assets.about);

  if (Array.isArray(content.services)) {
    content.services.forEach((service) => {
      const assetKey = serviceAssetByImageKey[service?.imageKey];

      if (assetKey) {
        applyImage(service, "image", assets[assetKey]);
      }
    });
  }

  ensureProjectItems(content);
  content.projects.items.forEach((project, index) => {
    const pairIndex = (index % 4) + 1;

    applyImage(project, "beforeImage", assets[`project${pairIndex}Before`]);
    applyImage(project, "afterImage", assets[`project${pairIndex}After`]);
  });

  const { error: updateError } = await supabase.from(TABLE).upsert(
    {
      slug: SLUG,
      content,
    },
    { onConflict: "slug" },
  );

  if (updateError) {
    throw new Error(updateError.message);
  }

  console.log(
    `Uploaded ${assetDefinitions.length} images to ${bucket}/${MEDIA_FOLDER} and updated the ${SLUG} landing page CMS content.`,
  );

  if (!force) {
    console.log(
      "Existing CMS image selections were preserved. Rerun with --force to replace them.",
    );
  }
}

async function uploadAsset(definition) {
  const absolutePath = path.join(process.cwd(), definition.localPath);
  const file = await readFile(absolutePath);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(definition.storagePath, file, {
      cacheControl: "3600",
      contentType: contentTypeForPath(definition.localPath),
      upsert: true,
    });

  if (error) {
    throw new Error(
      `Unable to upload ${definition.localPath} to ${definition.storagePath}: ${error.message}`,
    );
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(definition.storagePath);

  return {
    url: data.publicUrl,
    alt: definition.alt,
    path: definition.storagePath,
  };
}

function applyImage(target, key, asset) {
  if (!target || typeof target !== "object") {
    return;
  }

  const current = target[key];
  const shouldReplace =
    force ||
    !current ||
    typeof current !== "object" ||
    !current.url ||
    !current.path;

  if (!shouldReplace) {
    return;
  }

  target[key] = {
    url: asset.url,
    alt:
      current && typeof current === "object" && current.alt
        ? current.alt
        : asset.alt,
    path: asset.path,
  };
}

function ensureProjectItems(content) {
  if (!content.projects || typeof content.projects !== "object") {
    content.projects = {};
  }

  if (!Array.isArray(content.projects.items)) {
    content.projects.items = [];
  }

  while (content.projects.items.length < 4) {
    const defaultProject = defaultProjects[content.projects.items.length];

    content.projects.items.push({
      ...defaultProject,
      beforeImage: {
        url: "",
        alt: `${defaultProject.title} before service`,
        path: "",
      },
      afterImage: {
        url: "",
        alt: `${defaultProject.title} after service`,
        path: "",
      },
    });
  }
}

function contentTypeForPath(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".avif":
      return "image/avif";
    default:
      return "application/octet-stream";
  }
}

function loadDotEnv() {
  const envPath = path.join(process.cwd(), ".env");

  return readFile(envPath, "utf8")
    .then((file) => {
      for (const line of file.split(/\r?\n/)) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith("#")) {
          continue;
        }

        const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

        if (!match) {
          continue;
        }

        const [, name, rawValue] = match;

        if (process.env[name] !== undefined) {
          continue;
        }

        process.env[name] = unquoteEnvValue(rawValue);
      }
    })
    .catch((error) => {
      if (error.code !== "ENOENT") {
        throw error;
      }
    });
}

function unquoteEnvValue(value) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function readRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
