import { Test, TestingModule } from '@nestjs/testing';
import { VideosController } from './videos.controller';

describe('VideoController', () => {
  let controller: VideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideosController],
    }).compile();

    controller = module.get<VideosController>(VideosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
