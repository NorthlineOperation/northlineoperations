// Shared postMessage contract between the CMS editor and the preview iframe.
// The editor (parent) sends draft content; the preview frame announces readiness.

export const PREVIEW_MESSAGE_TYPE = "northline-cms-preview";
export const PREVIEW_READY_TYPE = "northline-cms-preview-ready";

export type PreviewContentMessage = {
  type: typeof PREVIEW_MESSAGE_TYPE;
  content: unknown;
};

export type PreviewReadyMessage = {
  type: typeof PREVIEW_READY_TYPE;
};
