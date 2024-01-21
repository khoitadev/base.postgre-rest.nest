import { Module } from '@nestjs/common';
import { LanguageService } from '~/language/language.service';
import { LanguageController } from '~/language/language.controller';

@Module({
  imports: [],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
