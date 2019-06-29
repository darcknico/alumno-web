import { ComisionesModule } from './comisiones.module';

describe('ComisionesModule', () => {
  let comisionesModule: ComisionesModule;

  beforeEach(() => {
    comisionesModule = new ComisionesModule();
  });

  it('should create an instance', () => {
    expect(comisionesModule).toBeTruthy();
  });
});
