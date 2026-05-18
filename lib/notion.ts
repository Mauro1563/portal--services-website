import 'server-only';

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
