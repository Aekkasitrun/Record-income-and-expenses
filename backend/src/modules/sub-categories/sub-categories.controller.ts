import {
  Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@ApiTags('sub-categories')
@Controller('sub-categories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List sub-categories, optionally filtered by categoryId' })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  findAll(@Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number) {
    return this.subCategoriesService.findAll(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sub-category by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoriesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new sub-category' })
  create(@Body() dto: CreateSubCategoryDto) {
    return this.subCategoriesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sub-category' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubCategoryDto) {
    return this.subCategoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sub-category (fails if transactions exist)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subCategoriesService.remove(id);
  }
}
