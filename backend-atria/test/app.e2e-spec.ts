import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('AppModule (e2e)', () => {
  it('should compile', async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleFixture).toBeDefined();
  });
});
