import { Button } from '@mui/material'
import TranslateIcon from '@mui/icons-material/Translate'
import { useTranslation } from 'react-i18next'

export function LanguageToggle() {
  const { t, i18n } = useTranslation()
  const toggle = () => i18n.changeLanguage(i18n.language === 'th' ? 'en' : 'th')
  return (
    <Button color="inherit" startIcon={<TranslateIcon />} onClick={toggle} size="small">
      {t('language.toggle')}
    </Button>
  )
}
