import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(type?: TransactionType) {
    return this.prisma.category.findMany({
      where: type ? { type } : undefined,
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException(`Category #${id} not found`);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    const txCount = await this.prisma.transaction.count({ where: { categoryId: id } });
    if (txCount > 0) {
      throw new BadRequestException(
        `Cannot delete category: ${txCount} transaction(s) are using it.`,
      );
    }
    return this.prisma.category.delete({ where: { id } });
  }
}
