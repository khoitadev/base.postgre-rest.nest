import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Language } from '@prisma/client';
import { Public } from '~/auth/decorators/public.decorator';
import { CreateLanguageDto } from '~/dto';
import { LanguageService } from './language.service';

@ApiTags('language')
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Public()
  @Get('list')
  findAll(): Promise<Language[]> {
    return this.languageService.findAll({});
  }

  @Public()
  @Post('create')
  create(@Body() createLanguageDto: CreateLanguageDto): Promise<Language> {
    return this.languageService.create(createLanguageDto);
  }
}
