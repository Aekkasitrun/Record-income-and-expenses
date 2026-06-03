import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SubCategoriesModule } from './modules/sub-categories/sub-categories.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CategoriesModule,
    SubCategoriesModule,
    TransactionsModule,
    ReportsModule,
  ],
})
export class AppModule {}
