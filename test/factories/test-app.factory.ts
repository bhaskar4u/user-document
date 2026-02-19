import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

export async function createTestApp(
  rootModule: any,
  overrides: { provide: any; useValue: any }[] = [],
): Promise<INestApplication> {
  const builder = Test.createTestingModule({
    imports: [rootModule],
  });

  overrides.forEach((override) => {
    builder.overrideProvider(override.provide).useValue(override.useValue);
  });

  const moduleRef = await builder.compile();
  const app = moduleRef.createNestApplication();

  await app.init();

  return app;
}
