type StateCardProps = {
  eyebrow: string;
  title: string;
  message: string;
  tone?: 'neutral' | 'danger';
};

function StateCard({ eyebrow, title, message, tone = 'neutral' }: StateCardProps) {
  const accentClass = tone === 'danger'
    ? 'bg-danger/10 text-danger'
    : 'bg-accent/10 text-accent';

  return (
    <div className="flex justify-center py-12">
      <div className="w-full max-w-xl rounded-[24px] border border-border bg-bg-card p-8 text-center shadow-[0_24px_60px_rgba(10,61,98,0.08)]">
        <div className={`mx-auto mb-4 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${accentClass}`}>
          {eyebrow}
        </div>
        <h2 className="text-lg font-semibold text-brand-deep">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{message}</p>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <StateCard
      eyebrow="Cargando"
      title="Preparando la vista"
      message="Estamos reuniendo la informacion de tu espacio de trabajo Lumify."
    />
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <StateCard
      eyebrow="Incidencia"
      title="No pudimos completar la carga"
      message={message ?? 'Vuelve a intentarlo en unos instantes o revisa la conexion con el servicio.'}
      tone="danger"
    />
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <StateCard
      eyebrow="Sin contenido"
      title={title}
      message={message}
    />
  );
}
