import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from './seo.config';

export interface SeoTags {
  /** Full <title> text, already including the brand suffix. Keep under ~60 characters. */
  title: string;
  /** <meta name="description">. Keep to ~150-160 characters. */
  description: string;
  /** Path or absolute URL this page should be canonicalised to. */
  canonical: string;
  /**
   * <meta name="keywords">. Google ignores it, but Bing and several Indian
   * health aggregators still read it, and it costs nothing.
   */
  keywords?: string;
  /** Social-share image - path or absolute URL. Falls back to the site default. */
  image?: string;
  /** Alt text for the share image. */
  imageAlt?: string;
  /** "article" for content pages, "profile" for a person's page, "website" otherwise. */
  ogType?: string;
  /** Override only to deliberately hide a page, e.g. 'noindex, follow'. */
  robots?: string;
}

/**
 * Per-page head management: title, description, canonical, Open Graph,
 * Twitter cards and JSON-LD.
 *
 * Everything here goes through Angular's `Meta`/`Title` services and the
 * injected `DOCUMENT`, all of which work identically under SSR. That
 * matters: the doctor profile pages are prerendered (see
 * app.routes.server.ts), so tags set here are baked into the static HTML
 * that crawlers see, rather than being added by client-side JavaScript
 * after the fact.
 *
 * The service is intentionally stateless apart from tracking which
 * JSON-LD blocks it created, so `clearJsonLd()` can remove them on
 * navigation and one doctor's structured data never leaks onto the next
 * doctor's page during in-app routing.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);

  /** ids of the <script type="application/ld+json"> elements this service owns. */
  private readonly jsonLdIds = new Set<string>();

  apply(tags: SeoTags): void {
    const canonical = absoluteUrl(tags.canonical);
    const image = absoluteUrl(tags.image || DEFAULT_OG_IMAGE);

    this.titleService.setTitle(tags.title);

    this.setName('description', tags.description);
    this.setName('robots', tags.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    if (tags.keywords) this.setName('keywords', tags.keywords);

    // Open Graph - drives the preview card on WhatsApp and Facebook, which
    // is where most appointment links actually get shared in this market.
    this.setProperty('og:title', tags.title);
    this.setProperty('og:description', tags.description);
    this.setProperty('og:url', canonical);
    this.setProperty('og:type', tags.ogType || 'website');
    this.setProperty('og:site_name', SITE_NAME);
    this.setProperty('og:locale', 'en_IN');
    this.setProperty('og:image', image);
    this.setProperty('og:image:alt', tags.imageAlt || tags.title);

    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', tags.title);
    this.setName('twitter:description', tags.description);
    this.setName('twitter:image', image);

    this.setCanonical(canonical);
  }

  /**
   * Adds or replaces a JSON-LD block. `id` is the element's DOM id, so
   * calling this again with the same id updates in place instead of
   * stacking duplicate blocks (which is what happens if you naively
   * append on every navigation, and it makes Google pick one at random).
   */
  setJsonLd(id: string, data: unknown): void {
    const existing = this.doc.getElementById(id);
    const script = existing ?? this.doc.createElement('script');

    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', id);
    // JSON.stringify already escapes the characters that matter here; the
    // "</" guard stops a stray closing tag inside any string field from
    // terminating the <script> element early.
    script.textContent = JSON.stringify(data).replace(/<\//g, '<\\/');

    if (!existing) this.doc.head.appendChild(script);
    this.jsonLdIds.add(id);
  }

  /** Removes every JSON-LD block this service added - call on component destroy. */
  clearJsonLd(): void {
    for (const id of this.jsonLdIds) {
      this.doc.getElementById(id)?.remove();
    }
    this.jsonLdIds.clear();
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }

  private setCanonical(href: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
