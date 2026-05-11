'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lang, t } from '@/lib/i18n';

export default function ContactPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', size: '', message: '' });
  const tr = t(lang).contact;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to your email service (Resend, EmailJS, etc.)
    setSent(true);
  };

  const up = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm font-medium outline-none transition-all focus:border-[#ED8B00]";
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' };

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <main className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

            {/* Left — info */}
            <div>
              <h1 className="text-4xl font-black text-white mb-4">{tr.title}</h1>
              <p className="text-white/40 leading-relaxed mb-10">{tr.subtitle}</p>

              <div className="space-y-5">
                {[
                  { icon: '✅', text: lang === 'en' ? '20-minute live walkthrough' : lang === 'es' ? 'Demostración en vivo de 20 minutos' : 'Demonstração ao vivo de 20 minutos' },
                  { icon: '✅', text: lang === 'en' ? 'Tailored to your business size' : lang === 'es' ? 'Adaptado al tamaño de tu empresa' : 'Adaptado ao tamanho da sua empresa' },
                  { icon: '✅', text: lang === 'en' ? 'No commitment required' : lang === 'es' ? 'Sin compromiso' : 'Sem compromisso' },
                  { icon: '✅', text: lang === 'en' ? 'Response within 24 hours' : lang === 'es' ? 'Respuesta en menos de 24 horas' : 'Resposta em até 24 horas' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-white/60 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 rounded-2xl" style={{ background: 'rgba(237,139,0,0.06)', border: '1px solid rgba(237,139,0,0.15)' }}>
                <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest mb-3">
                  {lang === 'en' ? 'Contact directly' : lang === 'es' ? 'Contacto directo' : 'Contato direto'}
                </p>
                <p className="text-white/70 text-sm mb-1">📧 hello@portalservices.digital</p>
                <p className="text-white/70 text-sm mb-1">📞 +44 20 0000 0000</p>
                <p className="text-white/70 text-sm">💬 WhatsApp: +44 7000 000000</p>
              </div>
            </div>

            {/* Right — form */}
            <div className="p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {sent ? (
                <div className="text-center py-12">
                  <span className="text-5xl block mb-4">🎉</span>
                  <p className="text-white font-bold text-lg">{tr.form.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs text-white/30 font-bold uppercase tracking-widest mb-1.5">{tr.form.name}</label>
                      <input required className={inputClass} style={inputStyle} value={form.name} onChange={e => up('name', e.target.value)} placeholder="John Smith" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs text-white/30 font-bold uppercase tracking-widest mb-1.5">{tr.form.company}</label>
                      <input required className={inputClass} style={inputStyle} value={form.company} onChange={e => up('company', e.target.value)} placeholder="CleanCo Ltd" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/30 font-bold uppercase tracking-widest mb-1.5">{tr.form.email}</label>
                    <input required type="email" className={inputClass} style={inputStyle} value={form.email} onChange={e => up('email', e.target.value)} placeholder="john@cleancouk.com" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/30 font-bold uppercase tracking-widest mb-1.5">{tr.form.phone}</label>
                      <input className={inputClass} style={inputStyle} value={form.phone} onChange={e => up('phone', e.target.value)} placeholder="+44 7000 000000" />
                    </div>
                    <div>
                      <label className="block text-xs text-white/30 font-bold uppercase tracking-widest mb-1.5">{tr.form.size}</label>
                      <select required className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }} value={form.size} onChange={e => up('size', e.target.value)}>
                        <option value="">—</option>
                        {tr.form.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/30 font-bold uppercase tracking-widest mb-1.5">{tr.form.message}</label>
                    <textarea rows={4} className={inputClass} style={inputStyle} value={form.message} onChange={e => up('message', e.target.value)} placeholder="..." />
                  </div>

                  <button type="submit"
                    className="w-full py-4 rounded-xl font-black text-base text-[#0F172A] transition-all hover:opacity-90 hover:scale-[1.01] mt-2"
                    style={{ background: 'linear-gradient(135deg,#ED8B00,#F59E0B)', boxShadow: '0 8px 24px rgba(237,139,0,0.3)' }}>
                    {tr.form.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
