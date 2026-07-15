// Small shared presentational helpers used across admin pages.

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-3 py-16 text-sm text-slate">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-ink" />
      {label}
    </div>
  )
}

export function Empty({ children }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-2 py-16 text-center text-sm text-slate">
      {children}
    </div>
  )
}

const STATUS_STYLES = {
  published: 'bg-green-50 text-green-700',
  draft: 'bg-amber-50 text-amber-700',
  archived: 'bg-gray-100 text-gray-500',
  pending: 'bg-amber-50 text-amber-700',
  accepted: 'bg-blue-50 text-blue-700',
  packed: 'bg-blue-50 text-blue-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
  refunded: 'bg-orange-50 text-orange-600',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-600',
  paid: 'bg-green-50 text-green-700',
  failed: 'bg-red-50 text-red-600',
}

export function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
}

// Tables don't fit a phone, so every list renders as a table from `md` up and as
// stacked cards below it. Wrap the <table> in <DesktopTable> and the card list
// in <MobileList> so the two stay visually paired.
export function DesktopTable({ children }) {
  return (
    <div className="card hidden overflow-hidden md:block">
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}

export function MobileList({ children }) {
  return <div className="space-y-3 md:hidden">{children}</div>
}

export function MobileRow({ children }) {
  return <div className="card p-4">{children}</div>
}

// Label/value line inside a mobile card.
export function Field({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1 text-sm">
      <span className="text-xs uppercase tracking-wide text-slate">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  )
}

export const naira = (n) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(
    n || 0
  )
