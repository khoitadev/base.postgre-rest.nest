import { PrismaService } from '$prisma';
import { Injectable } from '@nestjs/common';
import { Language, Prisma } from '@prisma/client';

@Injectable()
export class LanguageService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.LanguageCreateInput): Promise<Language> {
    return this.prisma.language.create({ data });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LanguageWhereUniqueInput;
    where?: Prisma.LanguageWhereInput;
    orderBy?: Prisma.LanguageOrderByWithRelationInput;
  }): Promise<Language[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.language.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
