import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';

const NOTION_API = 'https://api.notion.com/v1/pages';
const NOTION_VERSION = '2022-06-28';

export class NotionNotConfiguredError extends Error {
  constructor() {
    super('Notion integration is not configured (missing env vars)');
    this.name = 'NotionNotConfiguredError';
  }
}

const readConfig = () => {
  const token = process.env.NOTION_TOKEN?.trim();
  const databaseId = process.env.NOTION_LEADS_DATABASE_ID?.trim();
  if (!token || !databaseId) return null;
  return { token, databaseId };
};

export const isNotionConfigured = () => readConfig() !== null;

const SUBJECT_OPTIONS = new Set([
  'Demo request',
  'Sales inquiry',
  'See it live',
  'Airbnb plan — start free trial',
  'Mid-market demo request',
  'Enterprise inquiry',
  'Website contact',
]);

const LOCALE_OPTIONS = new Set(['en', 'es', 'pt']);

const text = (value: string | undefined) =>
  value ? { rich_text: [{ text: { content: value.slice(0, 2000) } }] } : undefined;

const title = (value: string) => ({
  title: [{ text: { content: value.slice(0, 200) } }],
});

export type LeadPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  subject: string;
  locale: string;
};

export const appendLeadToNotion = async (lead: LeadPayload): Promise<void> => {
  const cfg = readConfig();
  if (!cfg) throw new NotionNotConfiguredError();

  const subject = SUBJECT_OPTIONS.has(lead.subject) ? lead.subject : 'Website contact';
  const locale = LOCALE_OPTIONS.has(lead.locale) ? lead.locale : 'en';

  const properties: Record<string, unknown> = {
    Name: title(lead.name),
    Email: { email: lead.email },
    Subject: { select: { name: subject } },
    Locale: { select: { name: locale } },
    Source: text('Website form'),
  };

  if (lead.phone) properties.Phone = { phone_number: lead.phone };
  if (lead.company) properties.Company = text(lead.company);
  if (lead.message) properties.Message = text(lead.message);

  const res = await fetch(NOTION_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      'Notion-Version': NOTION_VERSION,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      parent: { database_id: cfg.databaseId },
      properties,
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Notion responded ${res.status}: ${detail.slice(0, 300)}`);
  }
};

const stripDashes = (id: string) => id.replace(/-/g, '').toLowerCase();

const readProp = (props: Record<string, unknown>, key: string): unknown => {
  return (props as Record<string, unknown> | undefined)?.[key];
};

const extractTitle = (prop: unknown): string => {
  const arr = (prop as { title?: Array<{ plain_text?: string }> } | undefined)?.title;
  if (!Array.isArray(arr)) return '';
  return arr.map((t) => t?.plain_text ?? '').join('').trim();
};

const extractEmail = (prop: unknown): string =>
  (prop as { email?: string } | undefined)?.email ?? '';

const extractPhone = (prop: unknown): string =>
  (prop as { phone_number?: string } | undefined)?.phone_number ?? '';

const extractSelect = (prop: unknown): string =>
  (prop as { select?: { name?: string } } | undefined)?.select?.name ?? '';

const extractStatus = (prop: unknown): string =>
  (prop as { status?: { name?: string } } | undefined)?.status?.name ?? '';

const extractParentDatabaseId = (page: unknown): string => {
  const parent = (page as { parent?: { database_id?: string; data_source_id?: string } })?.parent;
  return parent?.database_id ?? parent?.data_source_id ?? '';
};

export type LeadPageSnapshot = {
  pageId: string;
  name: string;
  email: string;
  phone: string;
  locale: string;
  status: string;
};

export const fetchLeadFromPage = async (pageId: string): Promise<LeadPageSnapshot | null> => {
  const cfg = readConfig();
  if (!cfg) throw new NotionNotConfiguredError();

  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      'Notion-Version': NOTION_VERSION,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Notion page fetch ${res.status}: ${detail.slice(0, 300)}`);
  }

  const page = (await res.json()) as { properties?: Record<string, unknown> };
  const parentId = extractParentDatabaseId(page);
  if (parentId && stripDashes(parentId) !== stripDashes(cfg.databaseId)) {
    return null;
  }

  const props = page.properties ?? {};
  return {
    pageId,
    name: extractTitle(readProp(props, 'Name')),
    email: extractEmail(readProp(props, 'Email')),
    phone: extractPhone(readProp(props, 'Phone')),
    locale: extractSelect(readProp(props, 'Locale')),
    status: extractStatus(readProp(props, 'Status')),
  };
};

export const verifyNotionSignature = (
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean => {
  if (!signatureHeader) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const provided = signatureHeader.startsWith('sha256=')
    ? signatureHeader.slice(7)
    : signatureHeader;
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(provided, 'hex');
  if (a.length !== b.length || a.length === 0) return false;
  return timingSafeEqual(a, b);
};
