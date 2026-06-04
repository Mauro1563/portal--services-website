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
    <footer className="footer-v2">
      <div className="container">
        <div className="footer-v2-grid">
          <div>
            <a href="#" className="brand" aria-label="Portal Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Portal Home"
                height={64}
                style={{ display: 'block', height: 64, width: 'auto' }}
              />
            </a>
            <p className="footer-v2-tagline">{t('footerV2.tagline')}</p>
            <LangSwitch />
          </div>
          <div>
            <h4>{t('footerV2.colPlatform')}</h4>
            <ul>
              <li><a href="#portals">{t('footerV2.platform.portals')}</a></li>
              <li><a href="#tech">{t('footerV2.platform.tech')}</a></li>
              <li><a href="#pricing">{t('footerV2.platform.pricing')}</a></li>
              <li><a href="#security">{t('footerV2.platform.security')}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t('footerV2.colCompany')}</h4>
            <ul>
              <li><a href="mailto:hola@portalservices.digital">{t('footerV2.company.contact')}</a></li>
              <li><a href="mailto:hola@portalservices.digital?subject=Demo%20request">{t('footerV2.company.demo')}</a></li>
              <li><a href="#">{t('footerV2.company.blog')}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t('footerV2.colLegal')}</h4>
            <ul>
              <li><a href="#">{t('footerV2.legal.privacy')}</a></li>
              <li><a href="#">{t('footerV2.legal.terms')}</a></li>
              <li><a href="#">{t('footerV2.legal.gdpr')}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-v2-bottom">
          <span>{t('footerV2.bottom')}</span>
          <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>{t('footerV2.langs')}</span>
        </div>
      </div>
    </footer>
  );
}
