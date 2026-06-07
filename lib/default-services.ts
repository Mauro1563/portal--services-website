import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Seeds 4 default service types for an owner the first time they need them.
 * Idempotent — checks if the owner already has any service_types row, and
 * does nothing if so. Called from /signup (new owners) and on first visit
 * to /owner/tasks/new or /owner/services (back-fill for existing owners).
 */
export async function ensureDefaultServices(ownerId: string): Promise<void> {
  try {
    const admin = createAdminClient();
    const { count } = await admin
      .from('service_types')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', ownerId);
    if ((count ?? 0) > 0) return;

    const defaults = [
      {
        owner_id: ownerId,
        name: 'Limpieza estándar',
        description: 'Limpieza regular semanal o quincenal.',
        default_duration_min: 90,
        price_pence: 4500,
        sort_order: 1,
      },
      {
        owner_id: ownerId,
        name: 'Limpieza profunda',
        description: 'Limpieza a fondo de cocina, baños y todas las áreas.',
        default_duration_min: 180,
        price_pence: 9500,
        sort_order: 2,
      },
      {
        owner_id: ownerId,
        name: 'Turnover Airbnb',
        description: 'Limpieza entre huéspedes con reposición de amenities.',
        default_duration_min: 120,
        price_pence: 6500,
        sort_order: 3,
      },
      {
        owner_id: ownerId,
        name: 'Limpieza por hora',
        description: 'Tarifa por hora — útil para servicios puntuales.',
        default_duration_min: 60,
        hourly_rate_pence: 2500,
        sort_order: 4,
      },
    ];

    await admin.from('service_types').insert(defaults);
  } catch (err) {
    console.error('[default-services] seed failed', err);
  }
}
