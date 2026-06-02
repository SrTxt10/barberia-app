create table if not exists clientes (
  socio integer primary key,
  nombre text not null,
  cedula text not null unique check (cedula ~ '^[0-9]{1,8}$'),
  fecha_registro date not null default current_date
);

create table if not exists cortes (
  id bigint generated always as identity primary key,
  socio integer not null references clientes(socio) on delete cascade,
  fecha date not null,
  servicio text not null,
  barbero text,
  notas text
);

create table if not exists reservas (
  id bigint generated always as identity primary key,
  socio integer not null references clientes(socio) on delete cascade,
  fecha date not null,
  hora time not null,
  servicio text not null,
  estado text not null default 'Pendiente'
);

alter table clientes enable row level security;
alter table cortes enable row level security;
alter table reservas enable row level security;

create policy "demo clientes select" on clientes for select using (true);
create policy "demo clientes insert" on clientes for insert with check (true);

create policy "demo cortes select" on cortes for select using (true);
create policy "demo cortes insert" on cortes for insert with check (true);

create policy "demo reservas select" on reservas for select using (true);
create policy "demo reservas insert" on reservas for insert with check (true);

insert into clientes (socio, nombre, cedula, fecha_registro) values
  (1001, 'Carlos Silva', '45678912', '2026-05-20'),
  (1002, 'Mateo Rodriguez', '32165498', '2026-05-22'),
  (1003, 'Nicolas Pereira', '51234876', '2026-05-25')
on conflict (socio) do nothing;

insert into cortes (socio, fecha, servicio, barbero, notas) values
  (1001, '2026-05-10', 'Corte clasico', 'Alex', 'Laterales prolijos'),
  (1001, '2026-04-26', 'Fade', 'Alex', 'Degradado bajo'),
  (1001, '2026-04-12', 'Corte + barba', 'Jose', 'Barba perfilada'),
  (1002, '2026-05-18', 'Barba', 'Jose', 'Mantenimiento'),
  (1003, '2026-05-21', 'Fade', 'Luis', 'Degradado medio');

insert into reservas (socio, fecha, hora, servicio, estado) values
  (1001, '2026-06-06', '16:00', 'Corte clasico', 'Pendiente'),
  (1001, '2026-06-14', '17:30', 'Corte + barba', 'Pendiente'),
  (1002, '2026-06-07', '15:00', 'Barba', 'Pendiente');
