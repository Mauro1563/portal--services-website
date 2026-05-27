import { getTranslations } from 'next-intl/server';
import { Icon, LOGO_FULL_URL } from './icons';
import { LangSwitch } from './LangSwitch';

export async function CTA() {
  const t = await getTranslations('psd');
  return (
    <section className="section">
      <div className="container">
        <div className="cta">
          <div className="cta-bg" />
          <h2 className="h-section" style={{ position: 'relative' }}>
            {t('cta.title_a')} <span className="serif">{t('cta.title_b')}</span>
          </h2>
          <p className="lede" style={{ position: 'relative' }}>{t('cta.sub')}</p>
          <div className="btns" style={{ position: 'relative' }}>
            <a className="btn btn-accent btn-lg" href="mailto:hola@portalservices.digital?subject=Demo%20request">
              {t('cta.primary')} <Icon.arrow />
            </a>
            <a className="btn btn-secondary btn-lg" href="mailto:hola@portalservices.digital?subject=Sales%20inquiry">
              {t('cta.secondary')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function Footer({ logoUrl = LOGO_FULL_URL }: { logoUrl?: string }) {
  const t = await getTranslations('psd');
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <a href="#" className="brand" aria-label="Portal Services Digital">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Portal Services Digital"
                height={64}
                style={{
                  display: 'block',
                  height: 64,
                  width: 'auto',
                  filter: 'saturate(1.25) contrast(1.18) brightness(0.82)',
                }}
              />
            </a>
            <p className="footer-tagline">{t('footer.tag')}</p>
            <div style={{ marginTop: 18 }}>
              <LangSwitch />
            </div>
          </div>
          <div>
            <h5>{t('footer.platform')}</h5>
            <ul>
              <li><a href="#portals">{t('footer.links.portals')}</a></li>
              <li><a href="#platform">{t('nav.platform')}</a></li>
              <li><a href="#pricing">{t('footer.links.pricing')}</a></li>
              <li><a href="#security">{t('footer.links.security')}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t('footer.company')}</h5>
            <ul>
              <li><a href="mailto:hola@portalservices.digital">{t('footer.links.contact')}</a></li>
              <li><a href="https://hq.portalservices.digital">{t('footer.links.login')}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t('footer.legal')}</h5>
            <ul>
              <li><a href="#">{t('footer.links.privacy')}</a></li>
              <li><a href="#">{t('footer.links.terms')}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t('footer.copyright')}</span>
          <span className="mono">v2.0 · 2026</span>
        </div>
      </div>
    </footer>
  );
}
