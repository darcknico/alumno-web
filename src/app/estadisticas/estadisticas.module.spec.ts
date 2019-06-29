import { EstadisticasModule } from './estadisticas.module';

describe('EstadisticasModule', () => {
  let estadisticasModule: EstadisticasModule;

  beforeEach(() => {
    estadisticasModule = new EstadisticasModule();
  });

  it('should create an instance', () => {
    expect(estadisticasModule).toBeTruthy();
  });
});
