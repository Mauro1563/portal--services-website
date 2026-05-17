import { Card } from './ui';
import {
  CalendarClock,
  Inbox,
  Plane,
  Users,
  MessageSquare,
  Camera,
  MapPin,
  CalendarSync,
} from 'lucide-react';

const features = [
  { icon: CalendarClock, title: 'Shift control by building', description: "Assign operatives to sites and shifts (day / night). See who's on, who's missing, who's covering — at a glance." },
  { icon: Inbox, title: 'Supervisor inbox', description: 'Every task lands in one inbox. Supervisors confirm completion, request cover, escalate incidents — without ten WhatsApp groups.' },
  { icon: Plane, title: 'Absence & holiday reports', description: 'Operatives request time off, supervisors approve, HQ sees coverage gaps before they hurt the SLA.' },
  { icon: Users, title: 'Community portal', description: 'WeWork-style hub for your operatives. Announcements, schedules, payslips, team directory — your brand, your rules.' },
  { icon: MessageSquare, title: 'HQ → Supervisor → Operative comms', description: 'Direct chat across the three levels. Broadcast to a building, a team, or one operative. Auto-translate optional.' },
  { icon: MapPin, title: 'Geo check-in / check-out', description: 'Operative confirms arrival at the right building. No more "I was there, I swear" — GPS-verified timesheet.' },
  { icon: Camera, title: 'Photo evidence per task', description: 'Cleaner uploads photo when the job is done. HQ and property managers see proof on every shift.' },
  { icon: CalendarSync, title: 'Airbnb iCal integration', description: 'Connect your Airbnb / Booking.com calendar. Tasks auto-create on every checkout — no manual scheduling.' },
];

export function FeatureShowcase() {
  return (
    <section id="solutions" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight">Everything your operations team needs.</h2>
          <p className="mt-4 text-slate-400">Built specifically for cleaning companies, facilities management and property managers — not generic SaaS retrofitted to fit.</p>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} hover className="p-6">
              <Icon className="mb-4 h-6 w-6 text-cyan-300" />
              <h3 className="font-display text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
