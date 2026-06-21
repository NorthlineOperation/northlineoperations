Northline Website : Admin Manual

A practical guide to managing the Northline Building Services website. No coding required : everything in this guide is done through the admin dashboard in your web browser.

> **Two kinds of settings.** Most things (text, images, FAQ, etc.) you change yourself in the **CMS** : covered in this manual. A few one-time technical settings (database, email, API keys) live in a secret server file and must be set by your **developer** : see [For Your Developer](#for-your-developer) at the end.

---

## Contents

1. [Signing in](#1-signing-in)
2. [The editor at a glance](#2-the-editor-at-a-glance)
3. [How editing works](#3-how-editing-works)
4. [Section-by-section guide](#4-section-by-section-guide)
5. [Managing images (Media Library)](#5-managing-images-media-library)
6. [Frequently Asked Questions (FAQ)](#6-frequently-asked-questions-faq)
7. [Google reviews](#7-google-reviews)
8. [Where form submissions go](#8-where-form-submissions-go)
9. [Saving &amp; publishing](#9-saving--publishing)
10. [SEO &amp; the privacy page](#10-seo--the-privacy-page)
11. [Tips &amp; best practices](#11-tips--best-practices)
12. [Troubleshooting](#12-troubleshooting)
13. [For your developer](#for-your-developer)

---

## 1. Signing in

1. Go to **`/admin`** on your website (for example, `https://yourdomain.com/admin`).
2. Enter your **email** and **password** and click **Sign in**.
3. You'll land on the admin dashboard. Open **Manage Landing Page** to edit the site.

**Forgot your password?**

- On the login screen, click **Forgot password?**
- Enter your email and submit. You'll receive an email with a reset link.
- Click the link, choose a new password, then sign in with it.

> Accounts are created by your developer/administrator. If you can't sign in and the reset email doesn't arrive, contact them.

---

## 2. The editor at a glance

The **Manage Landing Page** screen is where you control everything on the public homepage. Key things to know:

- **Tabs** across the top group the page into sections:
  **Hero · About · Services · Why & Mission · Projects · Quote & Footer · Media**
- **View site** : opens the live public site in a new tab so you can preview.
- **Load default** : replaces all current content with the original starter content. Use with care (see warning below).
- **Save changes** : publishes your edits to the live site.
- **Status badges** near the top tell you:
  - **Database content** / **Fallback content** : whether your saved content is in use yet.
  - **Unsaved changes** : you have edits that haven't been saved.

> ⚠️ **"Load default" and "Unsaved changes" warning.** Nothing is saved until you click **Save changes**. If you click *Load default* or navigate away with **Unsaved changes** showing, your edits can be lost. When in doubt, **Save** first.

> ℹ️ **First-time setup.** If you see a *"Using fallback content"* notice, just click **Save changes** once. This creates your editable content record. After that, your saved content is what the public site uses.

---

## 3. How editing works

The editor uses a few simple controls throughout:

- **Text boxes** : click and type. Short fields are single-line; longer ones (descriptions, paragraphs) are multi-line.
- **Dropdowns** : for things like choosing an **icon** or a **fallback image** style. Click and pick from the list.
- **Lists you can grow or shrink** : many areas (bullet points, pills, cities, FAQ, etc.) let you:
  - **Add** a new item with the **＋ Add…** button.
  - **Remove** an item with the **🗑 trash** button next to it.
- **Images** : handled by an image picker that lets you upload a new photo or reuse one from your Media Library, and set its **alt text** (a short description : important for accessibility and Google). See [Managing images](#5-managing-images-media-library).

Changes appear instantly in the editor but only go live when you **Save changes**.

---

## 4. Section-by-section guide

Each tab maps to a part of the public homepage.

### Hero (top of the page)

- **Hero copy** : the big headline (two lines), the short summary, the longer description, the two buttons (label + link), and the small "pill" tags (Licensed & Insured, etc.).
- **Hero background image** : the large photo behind the headline.

> Button links: use `#quote`, `#services`, `#contact`, `#about`, `#projects`, or `#faq` to jump to a section on the page, or a full web address (`https://…`) for an external link.

### About

- **About section** : eyebrow label, heading (two lines), intro, body paragraphs (add/remove as many as you like), the emphasis line, the image badge text, and the call-to-action button.
- **About image** : the photo shown beside the About text.

### Services

- **Services intro** : the eyebrow, heading, and description above the service cards.
- **Service cards** : each service has a **title**, an **icon**, a **fallback image** style, an **image**, and a list of **bullet points** (add/remove). Edit any card to update what that service offers.

### Why & Mission

- **Why choose section** : heading, description, the call-to-action, and the **reason tiles** (each has an icon + a short label; add/remove tiles).
- **Mission section** : the mission headings, description, the pull-quote, and the focus label/text.

### Projects

- **Projects section** : headings, description, the **project types** list, the **service area label**, and the **cities** you serve (add/remove cities).
- **Project gallery** : the before/after project cards. Each project has a **title, category, location, summary**, and a **before** and **after** image. These power both the homepage gallery and the "View all projects" popup.

### Quote & Footer

- **Quote CTA** : the "Ready to get started?" banner title, description, and button label.
- **Footer and contact** : the footer description, the column titles, your **contact details** (email, phone, location, website), the copyright line, and your **social links** (Facebook, LinkedIn, Instagram).
- **FAQ** : your questions and answers (see [section 6](#6-frequently-asked-questions-faq)).
- **Integrations** : your **Google Place ID** for showing Google reviews (see [section 7](#7-google-reviews)).

### Media

- **Media Library** : upload and manage the images used across the site (see [section 5](#5-managing-images-media-library)).

> 📞 **Your contact details are used in many places.** The email and phone in **Footer and contact** also appear in the contact section, the "call us" buttons, and are used in the privacy policy. Update them here and they change everywhere.

---

## 5. Managing images (Media Library)

There are two ways to add an image to a field:

1. **Upload directly** in any image field : choose a file from your computer; it's added to your Media Library automatically.
2. **Reuse an existing image** : pick one you've already uploaded from the Media Library.

**Always fill in the image's alt text** : a short, plain description of the photo (e.g., "Janitorial team cleaning an office lobby"). This helps visually impaired visitors and improves how Google understands your images.

In the **Media** tab you can upload new images and remove ones you no longer need.

> Tip: use good-quality, correctly-oriented photos. Very large files load slowly : a web-optimized JPG or PNG (typically under ~2 MB) is ideal.

---

## 6. Frequently Asked Questions (FAQ)

Found under **Quote & Footer → FAQ**.

- Each item has a **Question** and an **Answer**.
- Click **＋ Add question** to add one, or the **🗑 trash** icon to remove one.
- On the public site the FAQ is a collapsible section : visitors expand it and click each question to reveal the answer.

> 💡 The FAQ also helps your search rankings: well-written questions and answers can appear directly in Google results and AI assistants. Write them the way a real customer would ask (e.g., "Do you clean after construction?").

---

## 7. Google reviews

You can display your Google Business reviews on the homepage. The reviews section appears **automatically** once two things are in place:

1. **Google Place ID** : you set this yourself in **Quote & Footer → Integrations**.
   - Find your Place ID using Google's finder: search "Google Place ID Finder" or visit
     `https://developers.google.com/maps/documentation/places/web-service/place-id`.
   - Paste it into the **Google Place ID** field and **Save changes**.
2. **Google API key** : a one-time technical setting your developer adds to the server (see [For Your Developer](#for-your-developer)).

Once both are set, your overall rating and recent reviews show up on the site (refreshed every few hours). Google provides up to **5** reviews through this method. If the Place ID or key is missing, the section simply doesn't appear : nothing breaks.

---

## 8. Where form submissions go

The website has three forms. Here's what happens when a visitor submits each:

| Form                                    | What it's for          | What happens                                                                                             |
| --------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| **Request a Quote**               | Service quote requests | Saved to your database**and** emailed to your admin inbox (with any uploaded floor plan attached). |
| **Contact** ("Send us a message") | General questions      | Emailed to your admin inbox.                                                                             |
| **Join the Team**                 | Job applications       | Emailed to your admin inbox with the applicant's**résumé (PDF)** attached.                       |

**Email delivery** requires a one-time email (SMTP) setup by your developer. Until that's configured, quote requests are still **saved** (you won't lose them), but the email notifications won't send. Contact messages and job applications rely on email, so they need that setup to reach you.

> The inbox these go to is configured by your developer (defaults to your business email). You can have different inboxes for quotes, contact messages, and applications if you'd like : ask your developer.

---

## 9. Saving & publishing

- Click **Save changes** to publish. Your edits go live on the public site right away.
- The **Unsaved changes** badge reminds you when you have edits that aren't saved yet.
- There is **no autosave** : if you close the tab without saving, unsaved edits are lost.
- After saving, click **View site** to confirm everything looks right.

---

## 10. SEO & the privacy page

These work automatically : there's nothing you must do, but it's good to know:

- **Search & AI visibility** is built in: the site generates structured data, a sitemap, social-share previews, and an FAQ feed for search engines and AI assistants from your live content. Keeping your text, services, FAQ, and contact details accurate directly improves how you appear in Google and AI answers.
- **Privacy Policy** lives at **`/privacy`** and is linked in the footer. It automatically uses your contact details from the CMS.

> ⚖️ The privacy policy is a solid general-purpose template, not legal advice. Have it reviewed by an attorney before relying on it, and make sure it matches how you actually handle data.

---

## 11. Tips & best practices

- **Save often**, and **Save before** clicking *Load default* or leaving the page.
- **Preview** with **View site** after big changes.
- **Write alt text** for every image.
- **Keep contact info current** : it's used across the site, the privacy page, and email replies.
- **Keep the FAQ fresh** : it's one of the easiest ways to improve search visibility.
- **Use web-optimized images** so pages load fast.
- Headlines are often shown in **UPPERCASE** by the design automatically : type normally; you don't need to shout.

---

## 12. Troubleshooting

**My changes aren't showing on the live site.**
Did you click **Save changes**? Then refresh the public page. If you still don't see them, you may have been editing with **Unsaved changes** and navigated away.

**I see "Using fallback content."**
Click **Save changes** once to create your editable content record.

**The reviews section isn't appearing.**
Confirm your **Google Place ID** is set in *Integrations* and saved, and ask your developer to confirm the Google API key is configured. Also note it can take a few hours to refresh, and Google must actually have reviews for your business.

**I'm not receiving form emails.**
The email (SMTP) setup is likely not configured yet : ask your developer. Quote requests are still saved in the database regardless.

**An input "jumps" or I lost my place while typing.**
Make sure you're on the latest version of the site. If anything behaves oddly, take a screenshot and send it to your developer.

**I accidentally clicked "Load default."**
Don't click **Save changes**. Refresh the page : your last saved content will reload, undoing the default load (as long as you didn't save).

---

## For the developer

A few capabilities depend on server **environment variables** (a secret `.env` file), not the CMS. See `.env.example` in the project for the full list. Summary:

- **Database, auth & storage** : Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc.). Powers admin login, saved content, image storage, and quote-request storage. The CMS table migration lives in `supabase/migrations/`.
- **Email notifications** : SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`). Sends quote, contact, and job-application emails. Set `ADMIN_EMAIL` for the destination (or the per-type `*_EMAIL_TO` overrides).
- **Google reviews** : `GOOGLE_PLACES_API_KEY` (enable "Places API (New)" in Google Cloud). The Place ID is set in the CMS (Integrations) and takes priority over the optional `GOOGLE_PLACE_ID` env value.
- **Canonical domain (SEO)** : `NEXT_PUBLIC_SITE_URL`. Set this to the real production domain so canonical URLs, the sitemap, and social-share tags resolve correctly.

After changing environment variables, the site must be restarted/redeployed for them to take effect.
