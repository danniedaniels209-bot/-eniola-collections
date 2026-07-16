import { useState } from 'react'

// Shows the store's bank transfer details. Renders nothing unless an account
// number has been set in Admin → Settings.
export default function BankDetails({ bank, className = '' }) {
  const [copied, setCopied] = useState(false)

  if (!bank?.accountNumber) return null

  const copy = () => {
    navigator.clipboard?.writeText(bank.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`rounded-luxe border border-gold/30 bg-gold/5 p-5 ${className}`}>
      <p className="mb-4 text-[11px] uppercase tracking-luxe text-gold">Bank Transfer Details</p>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted">Account Number</p>
          <div className="flex items-center gap-3">
            <p className="font-display text-2xl font-semibold tracking-wide text-white">
              {bank.accountNumber}
            </p>
            <button
              type="button"
              onClick={copy}
              className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-white transition-colors hover:border-gold hover:text-gold"
            >
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted">Account Name</p>
            <p className="text-sm text-white">{bank.accountName}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Bank</p>
            <p className="text-sm text-white">{bank.bankName}</p>
          </div>
        </div>
      </div>

      {bank.instructions && (
        <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-muted">
          {bank.instructions}
        </p>
      )}
    </div>
  )
}
