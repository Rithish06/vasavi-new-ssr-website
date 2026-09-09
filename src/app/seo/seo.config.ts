/**
 * Site-wide SEO constants.
 *
 * These are the single source of truth for anything that has to be an
 * absolute URL or a real-world NAP (name / address / phone) value in
 * canonical tags, Open Graph tags and JSON-LD structured data. Keep them
 * byte-for-byte consistent with the Google Business Profile listing -
 * Google matches the schema.org address against the GBP one, and a
 * mismatched street line or pincode weakens the local signal instead of
 * strengthening it.
 */

/**
 * Canonical origin, no trailing slash. Every canonical/OG/JSON-LD URL is
 * built from this, so it must match the version of the domain that
 * actually serves the site (www vs non-www, https). If a staging build
 * ever needs a different origin, override it here rather than sprinkling
 * hostnames through the components.
 */
export const SITE_URL = 'https://www.vasavihospitals.com';

/** Used as `og:site_name` and as the publisher/organisation name in JSON-LD. */
export const SITE_NAME = 'Vasavi Hospitals';

/** Fallback social-share image (absolute URL is built by the SEO service). */
export const DEFAULT_OG_IMAGE = '/Images/og/vasavi-hospitals-og.jpg';

/**
 * Vasavi Hospitals, Kumaraswamy Layout - the NAP block reused by the
 * Hospital node and by each doctor's Physician node.
 *
 * `geo` is deliberately left out: publishing approximate coordinates for
 * a hospital is worse than publishing none, since Google will happily
 * pin the listing a few hundred metres off. Add `geo: { latitude, longitude }`
 * here once the exact values are copied from the Google Business Profile.
 */
export const HOSPITAL = {
  name: 'Vasavi Hospitals',
  streetAddress: '#716, 36th Cross, 7th Block, Kumaraswamy Layout',
  addressLocality: 'Bengaluru',
  addressRegion: 'Karnataka',
  postalCode: '560078',
  addressCountry: 'IN',
  /** Main hospital board line. */
  telephone: '+918071500500',
  /** Published toll-free appointment line. */
  tollFree: '+18004124779',
  email: 'appointments@vasavihospitals.com',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vasavi+Hospitals+Kumaraswamy+Layout+Bengaluru',
} as const;

/**
 * Verified social profiles - these become the Hospital node's `sameAs`
 * array, which is how Google reconciles "Vasavi Hospitals" the website
 * with "Vasavi Hospitals" the entity it already knows from elsewhere.
 */
export const HOSPITAL_SAME_AS = [
  'https://www.facebook.com/vasavihospitals',
  'https://www.linkedin.com/company/vasavihospitals/',
  'https://www.instagram.com/vasavi_hospitals/',
  'https://www.youtube.com/@vasavihospitalsyoutube',
] as const;

/** Stable @id anchors so JSON-LD nodes can reference each other instead of repeating themselves. */
export const SCHEMA_ID = {
  hospital: `${SITE_URL}/#hospital`,
  website: `${SITE_URL}/#website`,
} as const;

/** Absolute-URL helper - accepts a path ("/dr-nisha-buchade") or a full URL and always returns a full URL. */
export function absoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return SITE_URL + (pathOrUrl.startsWith('/') ? pathOrUrl : '/' + pathOrUrl);
}
