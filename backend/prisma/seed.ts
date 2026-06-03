import { PrismaClient, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

const defaultCategories = [
  { name: 'Salary', type: TransactionType.INCOME, icon: 'work', color: '#2e7d32', isDefault: true },
  { name: 'Freelance', type: TransactionType.INCOME, icon: 'laptop', color: '#1565c0', isDefault: true },
  { name: 'Investment', type: TransactionType.INCOME, icon: 'trending_up', color: '#6a1b9a', isDefault: true },
  { name: 'Other Income', type: TransactionType.INCOME, icon: 'attach_money', color: '#00695c', isDefault: true },
  { name: 'Food & Dining', type: TransactionType.EXPENSE, icon: 'restaurant', color: '#e65100', isDefault: true },
  { name: 'Transportation', type: TransactionType.EXPENSE, icon: 'directions_car', color: '#37474f', isDefault: true },
  { name: 'Shopping', type: TransactionType.EXPENSE, icon: 'shopping_cart', color: '#ad1457', isDefault: true },
  { name: 'Bills & Utilities', type: TransactionType.EXPENSE, icon: 'receipt', color: '#6d4c41', isDefault: true },
  { name: 'Entertainment', type: TransactionType.EXPENSE, icon: 'movie', color: '#c62828', isDefault: true },
  { name: 'Health', type: TransactionType.EXPENSE, icon: 'favorite', color: '#d81b60', isDefault: true },
  { name: 'Education', type: TransactionType.EXPENSE, icon: 'school', color: '#0277bd', isDefault: true },
  { name: 'Other Expense', type: TransactionType.EXPENSE, icon: 'category', color: '#546e7a', isDefault: true },
  { name: 'หุ้น', type: TransactionType.INVESTMENT, icon: 'trending_up', color: '#6a1b9a', isDefault: true },
  { name: 'กองทุน', type: TransactionType.INVESTMENT, icon: 'account_balance', color: '#4527a0', isDefault: true },
  { name: 'อสังหาริมทรัพย์', type: TransactionType.INVESTMENT, icon: 'home', color: '#283593', isDefault: true },
  { name: 'การลงทุนอื่นๆ', type: TransactionType.INVESTMENT, icon: 'savings', color: '#00695c', isDefault: true },
]

async function main() {
  console.log('Seeding default categories...')
  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    })
  }
  console.log('Seeding complete. 16 categories created.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
