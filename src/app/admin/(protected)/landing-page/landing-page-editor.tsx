"use client";

import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Database,
  ExternalLink,
  Eye,
  FileText,
  ImageIcon,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type {
  CmsImageAsset,
  LandingPageContent,
} from "@/lib/cms/landing-page-content";
import { cn } from "@/lib/utils";

type LandingPageEditorRecord = {
  slug: string;
  content: LandingPageContent;
  updatedAt: string | null;
  updatedBy: string | null;
  source: "database" | "fallback";
};

type ApiIssue = {
  path?: Array<string | number>;
  message?: string;
};

type ApiErrorBody = {
  error?: string;
  issues?: ApiIssue[];
};

type CmsMediaAsset = {
  name: string;
  path: string;
  url: string;
  size: number | null;
  contentType: string | null;
  updatedAt: string | null;
};

type ContentPath = Array<string | number>;

const blankImage: CmsImageAsset = { url: "", alt: "", path: "" };

const valuePropIconOptions = [
  { value: "shield", label: "Shield" },
  { value: "hardHat", label: "Hard hat" },
  { value: "clock", label: "Clock" },
  { value: "building", label: "Building" },
  { value: "shieldCheck", label: "Shield check" },
] as const;

const serviceIconOptions = [
  { value: "sparkles", label: "Sparkles" },
  { value: "sprayCan", label: "Spray can" },
  { value: "home", label: "Home" },
  { value: "trafficCone", label: "Traffic cone" },
] as const;

const serviceImageOptions = [
  { value: "post", label: "Post-construction fallback" },
  { value: "janitor", label: "Janitorial fallback" },
  { value: "moveout", label: "Move-out fallback" },
  { value: "site", label: "Site support fallback" },
] as const;

const whyChooseIconOptions = [
  { value: "message", label: "Message" },
  { value: "building", label: "Building" },
  { value: "shield", label: "Shield" },
  { value: "search", label: "Search" },
  { value: "user", label: "User" },
  { value: "award", label: "Award" },
] as const;

function createBlankProject(): LandingPageContent["projects"]["items"][number] {
  return {
    id: `project-${Date.now()}`,
    title: "New Project",
    category: "Commercial Cleaning",
    location: "Central Ohio",
    summary: "Project summary",
    beforeImage: { ...blankImage, alt: "Project before service" },
    afterImage: { ...blankImage, alt: "Project after service" },
  };
}

export function LandingPageEditor({
  initialRecord,
  defaultContent,
}: {
  initialRecord: LandingPageEditorRecord;
  defaultContent: LandingPageContent;
}) {
  const [record, setRecord] = useState(initialRecord);
  const [content, setContent] = useState(initialRecord.content);
  const [mediaAssets, setMediaAssets] = useState<CmsMediaAsset[]>([]);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(record.content),
    [content, record.content],
  );

  const loadMedia = useCallback(async () => {
    setIsLoadingMedia(true);
    setMediaError(null);

    try {
      const response = await fetch("/api/cms/media");
      const body = (await response.json().catch(() => ({}))) as {
        assets?: CmsMediaAsset[];
        error?: string;
      };

      if (!response.ok) {
        setMediaError(body.error ?? "Unable to load media.");
        return;
      }

      setMediaAssets(body.assets ?? []);
    } catch (requestError) {
      setMediaError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load media.",
      );
    } finally {
      setIsLoadingMedia(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadMedia();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadMedia]);

  async function saveContent() {
    setMessage(null);
    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/cms/landing-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const body = (await response.json().catch(() => ({}))) as
        | LandingPageEditorRecord
        | ApiErrorBody;

      if (!response.ok) {
        setError(formatApiError(body));
        return;
      }

      const nextRecord = body as LandingPageEditorRecord;
      setRecord(nextRecord);
      setContent(nextRecord.content);
      setMessage("Landing page content saved.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save landing page content.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function resetToDefault() {
    setContent(defaultContent);
    setMessage("Default landing page content loaded into the editor.");
    setError(null);
  }

  function setValue(path: ContentPath, value: unknown) {
    setContent((current) => setAtPath(current, path, value));
  }

  function addItem(path: ContentPath, value: unknown) {
    setContent((current) =>
      updateArrayAtPath(current, path, (items) => [...items, value]),
    );
  }

  function removeItem(path: ContentPath, index: number) {
    setContent((current) =>
      updateArrayAtPath(current, path, (items) =>
        items.filter((_, itemIndex) => itemIndex !== index),
      ),
    );
  }

  function moveItem(path: ContentPath, index: number, direction: -1 | 1) {
    setContent((current) =>
      updateArrayAtPath(current, path, (items) => {
        const nextIndex = index + direction;

        if (nextIndex < 0 || nextIndex >= items.length) {
          return items;
        }

        const nextItems = [...items];
        const item = nextItems[index];
        nextItems[index] = nextItems[nextIndex];
        nextItems[nextIndex] = item;

        return nextItems;
      }),
    );
  }

  function setImage(path: ContentPath, image: CmsImageAsset) {
    setValue(path, image);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="w-fit" variant="outline">
            Landing page
          </Badge>
          <Badge
            variant={record.source === "database" ? "secondary" : "outline"}
          >
            {record.source === "database"
              ? "Database content"
              : "Fallback content"}
          </Badge>
          {isDirty ? <Badge variant="outline">Unsaved changes</Badge> : null}
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Manage Landing Page
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Edit the landing page content and manage the images used on the
              public site.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/" target="_blank">
                <Eye data-icon="inline-start" />
                View site
              </Link>
            </Button>
            <Button type="button" variant="outline" onClick={resetToDefault}>
              <RotateCcw data-icon="inline-start" />
              Load default
            </Button>
            <Button type="button" onClick={saveContent} disabled={isSaving}>
              <Save data-icon="inline-start" />
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>

      {record.source === "fallback" ? (
        <Alert>
          <AlertCircle />
          <AlertTitle>Using fallback content</AlertTitle>
          <AlertDescription>
            Save once to create the database-backed CMS row for this page.
          </AlertDescription>
        </Alert>
      ) : null}

      {message ? (
        <Alert>
          <CheckCircle2 />
          <AlertTitle>Ready</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}

      {error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Unable to save</AlertTitle>
          <AlertDescription className="whitespace-pre-wrap">
            {error}
          </AlertDescription>
        </Alert>
      ) : null}

      {mediaError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Media error</AlertTitle>
          <AlertDescription>{mediaError}</AlertDescription>
        </Alert>
      ) : null}

      <Tabs defaultValue="hero" className="flex flex-col gap-4">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="why">Why & Mission</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="footer">Quote & Footer</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="m-0">
          <EditorGrid>
            <Card>
              <CardHeader>
                <CardTitle>Hero copy</CardTitle>
                <CardDescription>
                  Main headline, supporting copy, buttons, and badges.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <TwoColumn>
                  <TextField
                    label="Title line 1"
                    value={content.hero.titleLine1}
                    onChange={(value) =>
                      setValue(["hero", "titleLine1"], value)
                    }
                  />
                  <TextField
                    label="Title line 2"
                    value={content.hero.titleLine2}
                    onChange={(value) =>
                      setValue(["hero", "titleLine2"], value)
                    }
                  />
                </TwoColumn>
                <TextareaField
                  label="Summary"
                  value={content.hero.summary}
                  rows={3}
                  onChange={(value) => setValue(["hero", "summary"], value)}
                />
                <TextareaField
                  label="Description"
                  value={content.hero.description}
                  rows={4}
                  onChange={(value) => setValue(["hero", "description"], value)}
                />
                <CtaFields
                  label="Primary button"
                  cta={content.hero.primaryCta}
                  onChange={(field, value) =>
                    setValue(["hero", "primaryCta", field], value)
                  }
                />
                <CtaFields
                  label="Secondary button"
                  cta={content.hero.secondaryCta}
                  onChange={(field, value) =>
                    setValue(["hero", "secondaryCta", field], value)
                  }
                />
                <StringListEditor
                  label="Hero badges"
                  items={content.hero.pills}
                  addLabel="Add badge"
                  onChange={(index, value) =>
                    setValue(["hero", "pills", index], value)
                  }
                  onAdd={() => addItem(["hero", "pills"], "New badge")}
                  onRemove={(index) => removeItem(["hero", "pills"], index)}
                />
              </CardContent>
            </Card>

            <ImagePicker
              label="Hero background image"
              fallbackLabel="Uses bundled hero image when empty"
              image={content.hero.image}
              mediaAssets={mediaAssets}
              onChange={(image) => setImage(["hero", "image"], image)}
              onMediaChanged={loadMedia}
            />
          </EditorGrid>
        </TabsContent>

        <TabsContent value="about" className="m-0">
          <EditorGrid>
            <Card>
              <CardHeader>
                <CardTitle>About section</CardTitle>
                <CardDescription>
                  Intro text, body paragraphs, and section CTA.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <TextField
                  label="Eyebrow"
                  value={content.about.eyebrow}
                  onChange={(value) => setValue(["about", "eyebrow"], value)}
                />
                <TwoColumn>
                  <TextField
                    label="Heading line 1"
                    value={content.about.headingLine1}
                    onChange={(value) =>
                      setValue(["about", "headingLine1"], value)
                    }
                  />
                  <TextField
                    label="Heading line 2"
                    value={content.about.headingLine2}
                    onChange={(value) =>
                      setValue(["about", "headingLine2"], value)
                    }
                  />
                </TwoColumn>
                <TextareaField
                  label="Intro"
                  value={content.about.intro}
                  rows={3}
                  onChange={(value) => setValue(["about", "intro"], value)}
                />
                <StringListEditor
                  label="Paragraphs"
                  items={content.about.paragraphs}
                  addLabel="Add paragraph"
                  multiline
                  onChange={(index, value) =>
                    setValue(["about", "paragraphs", index], value)
                  }
                  onAdd={() =>
                    addItem(["about", "paragraphs"], "New paragraph")
                  }
                  onRemove={(index) =>
                    removeItem(["about", "paragraphs"], index)
                  }
                />
                <TextareaField
                  label="Emphasis"
                  value={content.about.emphasis}
                  rows={2}
                  onChange={(value) => setValue(["about", "emphasis"], value)}
                />
                <TextField
                  label="Image badge"
                  value={content.about.imageBadge}
                  onChange={(value) => setValue(["about", "imageBadge"], value)}
                />
                <CtaFields
                  label="CTA"
                  cta={content.about.cta}
                  onChange={(field, value) =>
                    setValue(["about", "cta", field], value)
                  }
                />
              </CardContent>
            </Card>

            <ImagePicker
              label="About image"
              fallbackLabel="Uses bundled van image when empty"
              image={content.about.image}
              mediaAssets={mediaAssets}
              onChange={(image) => setImage(["about", "image"], image)}
              onMediaChanged={loadMedia}
            />
          </EditorGrid>
        </TabsContent>

        <TabsContent value="services" className="m-0">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Services intro</CardTitle>
                <CardDescription>
                  Section heading and description above the service cards.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <TextField
                  label="Eyebrow"
                  value={content.servicesIntro.eyebrow}
                  onChange={(value) =>
                    setValue(["servicesIntro", "eyebrow"], value)
                  }
                />
                <TwoColumn>
                  <TextField
                    label="Heading prefix"
                    value={content.servicesIntro.headingPrefix}
                    onChange={(value) =>
                      setValue(["servicesIntro", "headingPrefix"], value)
                    }
                  />
                  <TextField
                    label="Highlighted heading"
                    value={content.servicesIntro.headingHighlight}
                    onChange={(value) =>
                      setValue(["servicesIntro", "headingHighlight"], value)
                    }
                  />
                </TwoColumn>
                <TextareaField
                  label="Description"
                  value={content.servicesIntro.description}
                  rows={3}
                  onChange={(value) =>
                    setValue(["servicesIntro", "description"], value)
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle>Service cards</CardTitle>
                    <CardDescription>
                      Manage services, bullets, icons, and card images.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      addItem(["services"], {
                        imageKey: "post",
                        image: blankImage,
                        iconKey: "sparkles",
                        title: "NEW SERVICE",
                        bullets: ["New bullet"],
                      })
                    }
                  >
                    <Plus data-icon="inline-start" />
                    Add service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {content.services.map((service, serviceIndex) => (
                    <AccordionItem
                      key={`service-${serviceIndex}`}
                      value={`service-${serviceIndex}`}
                    >
                      <AccordionTrigger>
                        {service.title || `Service ${serviceIndex + 1}`}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                          <div className="flex flex-col gap-6">
                            <TextField
                              label="Title"
                              value={service.title}
                              onChange={(value) =>
                                setValue(
                                  ["services", serviceIndex, "title"],
                                  value,
                                )
                              }
                            />
                            <TwoColumn>
                              <SelectField
                                label="Icon"
                                value={service.iconKey}
                                options={serviceIconOptions}
                                onChange={(value) =>
                                  setValue(
                                    ["services", serviceIndex, "iconKey"],
                                    value,
                                  )
                                }
                              />
                              <SelectField
                                label="Fallback image"
                                value={service.imageKey}
                                options={serviceImageOptions}
                                onChange={(value) =>
                                  setValue(
                                    ["services", serviceIndex, "imageKey"],
                                    value,
                                  )
                                }
                              />
                            </TwoColumn>
                            <StringListEditor
                              label="Bullets"
                              items={service.bullets}
                              addLabel="Add bullet"
                              onChange={(bulletIndex, value) =>
                                setValue(
                                  [
                                    "services",
                                    serviceIndex,
                                    "bullets",
                                    bulletIndex,
                                  ],
                                  value,
                                )
                              }
                              onAdd={() =>
                                addItem(
                                  ["services", serviceIndex, "bullets"],
                                  "New bullet",
                                )
                              }
                              onRemove={(bulletIndex) =>
                                removeItem(
                                  ["services", serviceIndex, "bullets"],
                                  bulletIndex,
                                )
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="w-fit"
                              disabled={content.services.length <= 1}
                              onClick={() =>
                                removeItem(["services"], serviceIndex)
                              }
                            >
                              <Trash2 data-icon="inline-start" />
                              Remove service
                            </Button>
                          </div>
                          <ImagePicker
                            label="Service image"
                            fallbackLabel="Uses selected fallback image when empty"
                            image={service.image}
                            mediaAssets={mediaAssets}
                            onChange={(image) =>
                              setImage(
                                ["services", serviceIndex, "image"],
                                image,
                              )
                            }
                            onMediaChanged={loadMedia}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="why" className="m-0">
          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Why choose section</CardTitle>
                <CardDescription>
                  Section copy, CTA, and reason tiles.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <TextField
                  label="Eyebrow"
                  value={content.whyChoose.eyebrow}
                  onChange={(value) =>
                    setValue(["whyChoose", "eyebrow"], value)
                  }
                />
                <TwoColumn>
                  <TextField
                    label="Heading line 1"
                    value={content.whyChoose.headingLine1}
                    onChange={(value) =>
                      setValue(["whyChoose", "headingLine1"], value)
                    }
                  />
                  <TextField
                    label="Heading line 2"
                    value={content.whyChoose.headingLine2}
                    onChange={(value) =>
                      setValue(["whyChoose", "headingLine2"], value)
                    }
                  />
                </TwoColumn>
                <TextareaField
                  label="Description"
                  value={content.whyChoose.description}
                  rows={4}
                  onChange={(value) =>
                    setValue(["whyChoose", "description"], value)
                  }
                />
                <CtaFields
                  label="CTA"
                  cta={content.whyChoose.cta}
                  onChange={(field, value) =>
                    setValue(["whyChoose", "cta", field], value)
                  }
                />
                <ReasonListEditor
                  items={content.whyChoose.items}
                  onChange={(index, field, value) =>
                    setValue(["whyChoose", "items", index, field], value)
                  }
                  onAdd={() =>
                    addItem(["whyChoose", "items"], {
                      iconKey: "shield",
                      label: "New reason",
                    })
                  }
                  onRemove={(index) =>
                    removeItem(["whyChoose", "items"], index)
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mission section</CardTitle>
                <CardDescription>
                  Mission headline, quote, and focus statement.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <TwoColumn>
                  <TextField
                    label="Heading line 1"
                    value={content.mission.headingLine1}
                    onChange={(value) =>
                      setValue(["mission", "headingLine1"], value)
                    }
                  />
                  <TextField
                    label="Heading line 2"
                    value={content.mission.headingLine2}
                    onChange={(value) =>
                      setValue(["mission", "headingLine2"], value)
                    }
                  />
                </TwoColumn>
                <TextareaField
                  label="Description"
                  value={content.mission.description}
                  rows={4}
                  onChange={(value) =>
                    setValue(["mission", "description"], value)
                  }
                />
                <TextField
                  label="Quote lead"
                  value={content.mission.quoteLead}
                  onChange={(value) =>
                    setValue(["mission", "quoteLead"], value)
                  }
                />
                <TextField
                  label="Quote emphasis"
                  value={content.mission.quoteEmphasis}
                  onChange={(value) =>
                    setValue(["mission", "quoteEmphasis"], value)
                  }
                />
                <TwoColumn>
                  <TextField
                    label="Focus label line 1"
                    value={content.mission.focusLabelLine1}
                    onChange={(value) =>
                      setValue(["mission", "focusLabelLine1"], value)
                    }
                  />
                  <TextField
                    label="Focus label line 2"
                    value={content.mission.focusLabelLine2}
                    onChange={(value) =>
                      setValue(["mission", "focusLabelLine2"], value)
                    }
                  />
                </TwoColumn>
                <TextareaField
                  label="Focus text"
                  value={content.mission.focusText}
                  rows={4}
                  onChange={(value) =>
                    setValue(["mission", "focusText"], value)
                  }
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="m-0">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projects section</CardTitle>
                <CardDescription>
                  Project copy, CTA, service area, and taxonomy.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <TwoColumn>
                  <TextField
                    label="Heading prefix"
                    value={content.projects.headingPrefix}
                    onChange={(value) =>
                      setValue(["projects", "headingPrefix"], value)
                    }
                  />
                  <TextField
                    label="Highlighted heading"
                    value={content.projects.headingHighlight}
                    onChange={(value) =>
                      setValue(["projects", "headingHighlight"], value)
                    }
                  />
                </TwoColumn>
                <TextareaField
                  label="Description"
                  value={content.projects.description}
                  rows={4}
                  onChange={(value) =>
                    setValue(["projects", "description"], value)
                  }
                />
                <CtaFields
                  label="CTA"
                  cta={content.projects.cta}
                  onChange={(field, value) =>
                    setValue(["projects", "cta", field], value)
                  }
                />
                <TextField
                  label="Service area label"
                  value={content.projects.serviceAreaLabel}
                  onChange={(value) =>
                    setValue(["projects", "serviceAreaLabel"], value)
                  }
                />
                <TwoColumn>
                  <StringListEditor
                    label="Project types"
                    items={content.projects.projectTypes}
                    addLabel="Add type"
                    onChange={(index, value) =>
                      setValue(["projects", "projectTypes", index], value)
                    }
                    onAdd={() =>
                      addItem(["projects", "projectTypes"], "New project type")
                    }
                    onRemove={(index) =>
                      removeItem(["projects", "projectTypes"], index)
                    }
                  />
                  <StringListEditor
                    label="Cities"
                    items={content.projects.cities}
                    addLabel="Add city"
                    onChange={(index, value) =>
                      setValue(["projects", "cities", index], value)
                    }
                    onAdd={() => addItem(["projects", "cities"], "New city")}
                    onRemove={(index) =>
                      removeItem(["projects", "cities"], index)
                    }
                  />
                </TwoColumn>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle>Project gallery</CardTitle>
                    <CardDescription>
                      The first four projects appear on the landing page.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      addItem(["projects", "items"], createBlankProject())
                    }
                  >
                    <Plus data-icon="inline-start" />
                    Add project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {content.projects.items.map((project, projectIndex) => (
                    <AccordionItem
                      key={project.id}
                      value={`project-${projectIndex}`}
                    >
                      <AccordionTrigger>
                        {projectIndex < 4
                          ? `${project.title} - Featured`
                          : project.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-6">
                          <div className="grid gap-5 xl:grid-cols-2">
                            <div className="flex flex-col gap-6">
                              <TextField
                                label="Project title"
                                value={project.title}
                                onChange={(value) =>
                                  setValue(
                                    [
                                      "projects",
                                      "items",
                                      projectIndex,
                                      "title",
                                    ],
                                    value,
                                  )
                                }
                              />
                              <TwoColumn>
                                <TextField
                                  label="Category"
                                  value={project.category}
                                  onChange={(value) =>
                                    setValue(
                                      [
                                        "projects",
                                        "items",
                                        projectIndex,
                                        "category",
                                      ],
                                      value,
                                    )
                                  }
                                />
                                <TextField
                                  label="Location"
                                  value={project.location}
                                  onChange={(value) =>
                                    setValue(
                                      [
                                        "projects",
                                        "items",
                                        projectIndex,
                                        "location",
                                      ],
                                      value,
                                    )
                                  }
                                />
                              </TwoColumn>
                              <TextareaField
                                label="Summary"
                                value={project.summary}
                                rows={4}
                                onChange={(value) =>
                                  setValue(
                                    [
                                      "projects",
                                      "items",
                                      projectIndex,
                                      "summary",
                                    ],
                                    value,
                                  )
                                }
                              />
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={projectIndex === 0}
                                  onClick={() =>
                                    moveItem(
                                      ["projects", "items"],
                                      projectIndex,
                                      -1,
                                    )
                                  }
                                >
                                  <ArrowUp data-icon="inline-start" />
                                  Move up
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={
                                    projectIndex ===
                                    content.projects.items.length - 1
                                  }
                                  onClick={() =>
                                    moveItem(
                                      ["projects", "items"],
                                      projectIndex,
                                      1,
                                    )
                                  }
                                >
                                  <ArrowDown data-icon="inline-start" />
                                  Move down
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={content.projects.items.length <= 4}
                                  onClick={() =>
                                    removeItem(
                                      ["projects", "items"],
                                      projectIndex,
                                    )
                                  }
                                >
                                  <Trash2 data-icon="inline-start" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                            <div className="rounded-md border bg-secondary p-4 text-sm text-muted-foreground">
                              {projectIndex < 4
                                ? "This project is visible on the landing page. The landing card uses the after photo only."
                                : "This project is visible in View all projects. Move it into the first four positions to feature it on the landing page."}
                            </div>
                          </div>
                          <div className="grid gap-4 lg:grid-cols-2">
                            <ImagePicker
                              label="Before photo"
                              fallbackLabel="Shown in project viewer and all-projects gallery"
                              image={project.beforeImage}
                              mediaAssets={mediaAssets}
                              onChange={(image) =>
                                setImage(
                                  [
                                    "projects",
                                    "items",
                                    projectIndex,
                                    "beforeImage",
                                  ],
                                  image,
                                )
                              }
                              onMediaChanged={loadMedia}
                            />
                            <ImagePicker
                              label="After photo"
                              fallbackLabel="Shown on the landing page for featured projects"
                              image={project.afterImage}
                              mediaAssets={mediaAssets}
                              onChange={(image) =>
                                setImage(
                                  [
                                    "projects",
                                    "items",
                                    projectIndex,
                                    "afterImage",
                                  ],
                                  image,
                                )
                              }
                              onMediaChanged={loadMedia}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="footer" className="m-0">
          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quote CTA</CardTitle>
                <CardDescription>
                  Gold quote band above the footer.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <TextField
                  label="Title"
                  value={content.quote.title}
                  onChange={(value) => setValue(["quote", "title"], value)}
                />
                <TextareaField
                  label="Description"
                  value={content.quote.description}
                  rows={4}
                  onChange={(value) =>
                    setValue(["quote", "description"], value)
                  }
                />
                <CtaFields
                  label="CTA"
                  cta={content.quote.cta}
                  onChange={(field, value) =>
                    setValue(["quote", "cta", field], value)
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Footer and contact</CardTitle>
                <CardDescription>
                  Footer copy, contact details, and social links.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <TextareaField
                  label="Description"
                  value={content.footer.description}
                  rows={3}
                  onChange={(value) =>
                    setValue(["footer", "description"], value)
                  }
                />
                <TwoColumn>
                  <TextField
                    label="Quick links title"
                    value={content.footer.quickLinksTitle}
                    onChange={(value) =>
                      setValue(["footer", "quickLinksTitle"], value)
                    }
                  />
                  <TextField
                    label="Services title"
                    value={content.footer.servicesTitle}
                    onChange={(value) =>
                      setValue(["footer", "servicesTitle"], value)
                    }
                  />
                </TwoColumn>
                <TextField
                  label="Contact title"
                  value={content.footer.contactTitle}
                  onChange={(value) =>
                    setValue(["footer", "contactTitle"], value)
                  }
                />
                <TwoColumn>
                  <TextField
                    label="Email"
                    value={content.footer.email}
                    onChange={(value) => setValue(["footer", "email"], value)}
                  />
                  <TextField
                    label="Phone"
                    value={content.footer.phone}
                    onChange={(value) => setValue(["footer", "phone"], value)}
                  />
                </TwoColumn>
                <TwoColumn>
                  <TextField
                    label="Location"
                    value={content.footer.location}
                    onChange={(value) =>
                      setValue(["footer", "location"], value)
                    }
                  />
                  <TextField
                    label="Website"
                    value={content.footer.website}
                    onChange={(value) => setValue(["footer", "website"], value)}
                  />
                </TwoColumn>
                <TextField
                  label="Copyright"
                  value={content.footer.copyright}
                  onChange={(value) => setValue(["footer", "copyright"], value)}
                />
                <Separator />
                <TwoColumn>
                  <TextField
                    label="Facebook URL"
                    value={content.footer.socialLinks.facebook}
                    onChange={(value) =>
                      setValue(["footer", "socialLinks", "facebook"], value)
                    }
                  />
                  <TextField
                    label="LinkedIn URL"
                    value={content.footer.socialLinks.linkedin}
                    onChange={(value) =>
                      setValue(["footer", "socialLinks", "linkedin"], value)
                    }
                  />
                </TwoColumn>
                <TextField
                  label="Instagram URL"
                  value={content.footer.socialLinks.instagram}
                  onChange={(value) =>
                    setValue(["footer", "socialLinks", "instagram"], value)
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
                <CardDescription>
                  Questions and answers shown in the FAQ section and used for
                  search-engine and AI rich results.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-3">
                  <Label>FAQ items</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addItem(["faq"], {
                        question: "New question",
                        answer: "New answer",
                      })
                    }
                  >
                    <Plus data-icon="inline-start" />
                    Add question
                  </Button>
                </div>
                {content.faq.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 rounded-md border p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-semibold">
                        Question {index + 1}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Remove question ${index + 1}`}
                        disabled={content.faq.length <= 1}
                        onClick={() => removeItem(["faq"], index)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    <TextField
                      label="Question"
                      value={item.question}
                      onChange={(value) =>
                        setValue(["faq", index, "question"], value)
                      }
                    />
                    <TextareaField
                      label="Answer"
                      value={item.answer}
                      onChange={(value) =>
                        setValue(["faq", index, "answer"], value)
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Paste your Google Place ID to show Google reviews on the site.
                  The reviews section appears automatically once this is set and
                  the GOOGLE_PLACES_API_KEY environment variable is configured.
                  Find your Place ID at
                  developers.google.com/maps/documentation/places/web-service/place-id.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TextField
                  label="Google Place ID"
                  value={content.integrations.googlePlaceId}
                  onChange={(value) =>
                    setValue(["integrations", "googlePlaceId"], value)
                  }
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="media" className="m-0">
          <MediaLibrary
            assets={mediaAssets}
            isLoading={isLoadingMedia}
            onRefresh={loadMedia}
            onDeleted={loadMedia}
          />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database data-icon="inline-start" />
            CMS record
          </CardTitle>
          <CardDescription>
            Current source and database metadata.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
            <MetadataItem label="Slug" value={record.slug} />
            <MetadataItem label="Source" value={record.source} />
            <MetadataItem
              label="Updated"
              value={
                record.updatedAt
                  ? new Intl.DateTimeFormat(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(record.updatedAt))
                  : "Not saved yet"
              }
            />
            <MetadataItem
              label="Updated by"
              value={record.updatedBy ?? "None"}
            />
          </dl>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Saved changes revalidate the public landing page.
          </p>
          <Button type="button" onClick={saveContent} disabled={isSaving}>
            <Save data-icon="inline-start" />
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function EditorGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      {children}
    </div>
  );
}

function TwoColumn({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-x-4 gap-y-6 md:grid-cols-2">{children}</div>;
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = labelToId(label);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  const id = labelToId(label);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Select
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as T)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function CtaFields({
  label,
  cta,
  onChange,
}: {
  label: string;
  cta: { label: string; href: string };
  onChange: (field: "label" | "href", value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-md border p-4">
      <div className="text-sm font-medium">{label}</div>
      <TwoColumn>
        <TextField
          label={`${label} label`}
          value={cta.label}
          onChange={(value) => onChange("label", value)}
        />
        <TextField
          label={`${label} link`}
          value={cta.href}
          onChange={(value) => onChange("href", value)}
        />
      </TwoColumn>
    </div>
  );
}

function StringListEditor({
  label,
  items,
  addLabel,
  multiline = false,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  addLabel: string;
  multiline?: boolean;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus data-icon="inline-start" />
          {addLabel}
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            {multiline ? (
              <Textarea
                value={item}
                rows={3}
                onChange={(event) => onChange(index, event.target.value)}
              />
            ) : (
              <Input
                value={item}
                onChange={(event) => onChange(index, event.target.value)}
              />
            )}
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Remove ${label} ${index + 1}`}
              disabled={items.length <= 1}
              onClick={() => onRemove(index)}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReasonListEditor({
  items,
  onChange,
  onAdd,
  onRemove,
}: {
  items: LandingPageContent["whyChoose"]["items"];
  onChange: (index: number, field: "iconKey" | "label", value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <Label>Reason tiles</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus data-icon="inline-start" />
          Add reason
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-md border p-3 md:grid-cols-[180px_minmax(0,1fr)_auto]"
          >
            <SelectField
              label="Icon"
              value={item.iconKey}
              options={whyChooseIconOptions}
              onChange={(value) => onChange(index, "iconKey", value)}
            />
            <TextField
              label="Label"
              value={item.label}
              onChange={(value) => onChange(index, "label", value)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Remove reason ${index + 1}`}
              disabled={items.length <= 1}
              onClick={() => onRemove(index)}
              className="self-end"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImagePicker({
  label,
  fallbackLabel,
  image,
  mediaAssets,
  onChange,
  onMediaChanged,
}: {
  label: string;
  fallbackLabel: string;
  image: CmsImageAsset;
  mediaAssets: CmsMediaAsset[];
  onChange: (image: CmsImageAsset) => void;
  onMediaChanged: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploadError(null);
    setIsUploading(true);

    try {
      const response = await fetch("/api/cms/media", {
        method: "POST",
        body: formData,
      });
      const body = (await response.json().catch(() => ({}))) as {
        asset?: CmsMediaAsset;
        error?: string;
      };

      if (!response.ok || !body.asset) {
        setUploadError(body.error ?? "Unable to upload image.");
        return;
      }

      onChange({
        url: body.asset.url,
        alt: image.alt || readableName(body.asset.name),
        path: body.asset.path,
      });
      onMediaChanged();
    } catch (requestError) {
      setUploadError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to upload image.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  function useExisting(path: string) {
    const asset = mediaAssets.find((item) => item.path === path);

    if (!asset) {
      return;
    }

    onChange({
      url: asset.url,
      alt: image.alt || readableName(asset.name),
      path: asset.path,
    });
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon data-icon="inline-start" />
          {label}
        </CardTitle>
        <CardDescription>{fallbackLabel}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-md border bg-secondary">
          {image.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.url}
              alt={image.alt || label}
              className="aspect-video w-full object-cover"
            />
          ) : (
            <div className="grid aspect-video place-items-center text-sm text-muted-foreground">
              No CMS image selected
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Upload image</Label>
          <Input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={uploadImage}
            disabled={isUploading}
          />
        </div>

        {mediaAssets.length > 0 ? (
          <div className="flex flex-col gap-2">
            <Label>Use uploaded image</Label>
            <Select value={image.path || undefined} onValueChange={useExisting}>
              <SelectTrigger>
                <SelectValue placeholder="Select from media library" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {mediaAssets.map((asset) => (
                    <SelectItem key={asset.path} value={asset.path}>
                      {asset.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <TextField
          label={`${label} URL`}
          value={image.url}
          onChange={(value) => onChange({ ...image, url: value })}
        />
        <TextField
          label={`${label} alt text`}
          value={image.alt}
          onChange={(value) => onChange({ ...image, alt: value })}
        />

        {uploadError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Upload failed</AlertTitle>
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload data-icon="inline-start" />
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
        {image.url ? (
          <Button type="button" variant="outline" asChild>
            <a href={image.url} target="_blank">
              <ExternalLink data-icon="inline-start" />
              Open
            </a>
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange({ ...blankImage, alt: image.alt })}
        >
          Clear
        </Button>
      </CardFooter>
    </Card>
  );
}

function MediaLibrary({
  assets,
  isLoading,
  onRefresh,
  onDeleted,
}: {
  assets: CmsMediaAsset[];
  isLoading: boolean;
  onRefresh: () => void;
  onDeleted: () => void;
}) {
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);

  async function deleteAsset(path: string) {
    setDeleteError(null);
    setDeletingPath(path);

    try {
      const response = await fetch(
        `/api/cms/media?path=${encodeURIComponent(path)}`,
        { method: "DELETE" },
      );
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setDeleteError(body.error ?? "Unable to delete image.");
        return;
      }

      onDeleted();
    } catch (requestError) {
      setDeleteError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to delete image.",
      );
    } finally {
      setDeletingPath(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Media library</CardTitle>
            <CardDescription>
              Uploaded Supabase Storage images available to this CMS.
            </CardDescription>
          </div>
          <Button type="button" variant="outline" onClick={onRefresh}>
            <RefreshCw data-icon="inline-start" />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {deleteError ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Delete failed</AlertTitle>
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        ) : null}

        {assets.length === 0 ? (
          <div className="rounded-md border bg-secondary p-6 text-sm text-muted-foreground">
            No uploaded images yet. Upload from any image field.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {assets.map((asset) => (
              <div
                key={asset.path}
                className="overflow-hidden rounded-md border bg-background"
              >
                <div className="bg-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="aspect-video w-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{asset.name}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {asset.path}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <a href={asset.url} target="_blank">
                        <ExternalLink data-icon="inline-start" />
                        Open
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={deletingPath === asset.path}
                      onClick={() => deleteAsset(asset.path)}
                    >
                      <Trash2 data-icon="inline-start" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-secondary p-4">
      <dt className="font-medium">{label}</dt>
      <dd className="mt-1 break-all text-muted-foreground">{value}</dd>
    </div>
  );
}

function setAtPath<T>(source: T, path: ContentPath, value: unknown): T {
  const next = structuredClone(source);
  let target: unknown = next;

  for (const key of path.slice(0, -1)) {
    target = readAtKey(target, key);
  }

  writeAtKey(target, path[path.length - 1], value);

  return next;
}

function updateArrayAtPath<T>(
  source: T,
  path: ContentPath,
  updater: (items: unknown[]) => unknown[],
): T {
  const currentItems = readAtPath(source, path);

  if (!Array.isArray(currentItems)) {
    return source;
  }

  return setAtPath(source, path, updater(currentItems));
}

function readAtPath(source: unknown, path: ContentPath) {
  return path.reduce((target, key) => readAtKey(target, key), source);
}

function readAtKey(target: unknown, key: string | number) {
  if (Array.isArray(target) && typeof key === "number") {
    return target[key];
  }

  if (target && typeof target === "object") {
    return (target as Record<string, unknown>)[String(key)];
  }

  return undefined;
}

function writeAtKey(
  target: unknown,
  key: string | number | undefined,
  value: unknown,
) {
  if (key === undefined) {
    return;
  }

  if (Array.isArray(target) && typeof key === "number") {
    target[key] = value;
    return;
  }

  if (target && typeof target === "object") {
    (target as Record<string, unknown>)[String(key)] = value;
  }
}

function formatApiError(body: LandingPageEditorRecord | ApiErrorBody) {
  const errorBody = body as ApiErrorBody;

  if (Array.isArray(errorBody.issues) && errorBody.issues.length > 0) {
    return errorBody.issues
      .map((issue) => {
        const path = issue.path?.join(".") || "content";
        return `${path}: ${issue.message ?? "Invalid value"}`;
      })
      .join("\n");
  }

  return errorBody.error ?? "Unable to save landing page content.";
}

function labelToId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function readableName(name: string) {
  return name
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
}
