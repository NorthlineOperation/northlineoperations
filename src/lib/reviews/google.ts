import "server-only";

export type GoogleReview = {
  author: string;
  authorPhoto: string | null;
  authorUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
};

export type GoogleReviewsData = {
  rating: number | null;
  total: number | null;
  googleUrl: string | null;
  reviews: GoogleReview[];
};

type PlacesNewReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

type PlacesNewResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesNewReview[];
};

/**
 * Fetches Google Business reviews via the Places API (New). Returns null when
 * the feature is not configured (no API key / Place ID) or no reviews are
 * available, so the public site can simply omit the section.
 *
 * Result is cached for 6 hours to stay well within API quota and cost.
 */
export async function getGoogleReviews(
  placeIdOverride?: string,
): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  // Prefer the CMS-configured Place ID, fall back to the env value.
  const placeId = placeIdOverride?.trim() || process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return null;
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "rating,userRatingCount,googleMapsUri,reviews",
        },
        next: { revalidate: 21600 },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as PlacesNewResponse;

    const reviews: GoogleReview[] = Array.isArray(data.reviews)
      ? data.reviews
          .map((review) => ({
            author: review.authorAttribution?.displayName ?? "Google user",
            authorPhoto: review.authorAttribution?.photoUri ?? null,
            authorUrl: review.authorAttribution?.uri ?? null,
            rating: typeof review.rating === "number" ? review.rating : 0,
            text: review.text?.text ?? review.originalText?.text ?? "",
            relativeTime: review.relativePublishTimeDescription ?? "",
          }))
          .filter((review) => review.text.trim().length > 0)
      : [];

    if (reviews.length === 0) {
      return null;
    }

    return {
      rating: typeof data.rating === "number" ? data.rating : null,
      total:
        typeof data.userRatingCount === "number" ? data.userRatingCount : null,
      googleUrl: data.googleMapsUri ?? null,
      reviews,
    };
  } catch {
    return null;
  }
}
