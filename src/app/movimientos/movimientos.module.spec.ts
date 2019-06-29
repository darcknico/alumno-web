import { MovimientosModule } from './movimientos.module';

describe('MovimientosModule', () => {
  let movimientosModule: MovimientosModule;

  beforeEach(() => {
    movimientosModule = new MovimientosModule();
  });

  it('should create an instance', () => {
    expect(movimientosModule).toBeTruthy();
  });
});
