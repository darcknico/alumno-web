import { TiposMovimientoModule } from './tipos-movimiento.module';

describe('TiposMovimientoModule', () => {
  let tiposMovimientoModule: TiposMovimientoModule;

  beforeEach(() => {
    tiposMovimientoModule = new TiposMovimientoModule();
  });

  it('should create an instance', () => {
    expect(tiposMovimientoModule).toBeTruthy();
  });
});
