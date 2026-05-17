import { Card } from './ui';

const items = ['Slack', 'Microsoft Teams', 'Google Workspace', 'Outlook', 'Stripe', 'Zapier', 'Okta SSO', 'SAML', 'Twilio', 'Webhook'];

export function Integrations() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight">Plays nicely with your stack.</h2>
          <p className="mt-4 text-slate-400">SSO, webhooks, REST API and native integrations — connect Portal Services Digital to the tools your team already uses.</p>
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
