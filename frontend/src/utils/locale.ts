import i18n from '@/i18n/index'

function getLocale(): string {
  return i18n.language === 'en' ? 'en-US' : 'th-TH'
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'THB' }).format(amount)
}

export function formatCurrencyCompact(amount: number): string {
  return new Intl.NumberFormat(getLocale(), {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(amount)
}
