import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@Injectable()
export class SubCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(categoryId?: number) {
    return this.prisma.subCategory.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: [{ categoryId: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: number) {
    const sub = await this.prisma.subCategory.findUnique({ where: { id } });
    if (!sub) throw new NotFoundException(`SubCategory #${id} not found`);
    return sub;
  }

  async create(dto: CreateSubCategoryDto) {
    return this.prisma.subCategory.create({ data: dto });
  }

  async update(id: number, dto: UpdateSubCategoryDto) {
    await this.findOne(id);
    return this.prisma.subCategory.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    const txCount = await this.prisma.transaction.count({ where: { subCategoryId: id } });
    if (txCount > 0) {
      throw new BadRequestException(
        `Cannot delete sub-category: ${txCount} transaction(s) are using it.`,
      );
    }
    return this.prisma.subCategory.delete({ where: { id } });
  }
}
