-- Migration 0010 — task scheduling time + payment block

-- Hora de inicio del turno (opcional). Si null, la tarea es "todo el día".
alter table public.tasks
  add column if not exists start_time time without time zone;

-- Estado y detalles de pago
alter table public.tasks
  add column if not exists payment_status text
    not null default 'pending'
    check (payment_status in ('pending', 'paid', 'partial', 'waived'));

alter table public.tasks
  add column if not exists payment_method text;
-- payment_method libre (efectivo, tarjeta, transferencia, bacs, etc.)
-- así no tenemos que migrar el enum cuando el dueño quiera añadir un nuevo método.

alter table public.tasks
  add column if not exists paid_at timestamptz;

alter table public.tasks
  add column if not exists paid_amount_pence int;
-- Permite registrar pagos parciales: si paid_amount_pence < price_pence,
-- el dueño puede dejar payment_status = 'partial'.

create index if not exists idx_tasks_payment_status
  on public.tasks (payment_status)
  where payment_status != 'paid';
