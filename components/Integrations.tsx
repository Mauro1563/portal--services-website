import { useTranslations } from 'next-intl';
import { Card } from './ui';

export function Integrations() {
  const t = useTranslations('integrations');
  const items = ['Slack', 'Microsoft Teams', 'Google Workspace', 'Outlook', 'Stripe', 'Zapier', 'Okta SSO', 'SAML', 'Twilio', 'Webhook'];
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight">{t('title')}</h2>
          <p className="mt-4 text-slate-300">{t('subtitle')}</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {items.map((name) => (
            <Card key={name} hover className="flex h-20 items-center justify-center p-4">
              <span className="text-sm font-medium text-slate-300">{name}</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
