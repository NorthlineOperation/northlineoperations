"use client";

import { ExternalLink, Star } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { GoogleReviewsData } from "@/lib/reviews/google";

export function ReviewsSection({ data }: { data: GoogleReviewsData }) {
  return (
    <section id="reviews" className="scroll-mt-24 bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="text-xs font-bold tracking-[0.25em] text-gold">
            CLIENT REVIEWS
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            What Our Clients Say
          </h2>

          {data.rating !== null ? (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              <span className="font-display text-3xl font-bold text-ink">
                {data.rating.toFixed(1)}
              </span>
              <Stars rating={data.rating} />
              {data.total !== null ? (
                <span className="text-sm text-muted-foreground">
                  based on {data.total.toLocaleString()} Google reviews
                </span>
              ) : null}
            </div>
          ) : null}

          {data.googleUrl ? (
            <a
              href={data.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold transition hover:gap-2.5"
            >
              View on Google
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>

        <div className="mt-12 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.reviews.map((review, index) => (
            <figure
              key={`${review.author}-${index}`}
              className="flex flex-col gap-4 rounded-lg border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  name={review.author}
                  photo={review.authorPhoto}
                  url={review.authorUrl}
                />
                <div className="min-w-0">
                  <div className="truncate font-semibold text-ink">
                    {review.author}
                  </div>
                  {review.relativeTime ? (
                    <div className="text-xs text-muted-foreground">
                      {review.relativeTime}
                    </div>
                  ) : null}
                </div>
              </div>
              <Stars rating={review.rating} />
              <blockquote className="text-sm leading-relaxed text-muted-foreground">
                {review.text}
              </blockquote>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Reviews are sourced from Google and shown as written.
        </p>
      </div>
    </section>
  );
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);

  return (
    <div
      className="flex gap-0.5"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn(
            "h-4 w-4",
            value <= filled
              ? "fill-current text-gold"
              : "fill-none text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
}

function Avatar({
  name,
  photo,
  url,
}: {
  name: string;
  photo: string | null;
  url: string | null;
}) {
  const [errored, setErrored] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "G";

  const inner =
    photo && !errored ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={name}
        width={40}
        height={40}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setErrored(true)}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    ) : (
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 text-sm font-bold text-gold">
        {initial}
      </div>
    );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return inner;
}
