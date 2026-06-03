import CategoryIcon from '@mui/icons-material/Category'
import WorkIcon from '@mui/icons-material/Work'
import LaptopIcon from '@mui/icons-material/Laptop'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ReceiptIcon from '@mui/icons-material/Receipt'
import MovieIcon from '@mui/icons-material/Movie'
import FavoriteIcon from '@mui/icons-material/Favorite'
import SchoolIcon from '@mui/icons-material/School'
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import HomeIcon from '@mui/icons-material/Home'
import SavingsIcon from '@mui/icons-material/Savings'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import type { SvgIconComponent } from '@mui/icons-material'

export const ICON_MAP: Record<string, SvgIconComponent> = {
  category: CategoryIcon,
  work: WorkIcon,
  laptop: LaptopIcon,
  trending_up: TrendingUpIcon,
  attach_money: AttachMoneyIcon,
  restaurant: RestaurantIcon,
  local_cafe: LocalCafeIcon,
  directions_car: DirectionsCarIcon,
  shopping_cart: ShoppingCartIcon,
  receipt: ReceiptIcon,
  movie: MovieIcon,
  favorite: FavoriteIcon,
  school: SchoolIcon,
  account_balance: AccountBalanceIcon,
  home: HomeIcon,
  savings: SavingsIcon,
  show_chart: ShowChartIcon,
  currency_bitcoin: CurrencyBitcoinIcon,
}

export const MUI_ICONS = Object.keys(ICON_MAP)
