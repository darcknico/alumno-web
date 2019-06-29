import { CuentacorrienteModule } from './cuentacorriente.module';

describe('CuentacorrienteModule', () => {
  let cuentacorrienteModule: CuentacorrienteModule;

  beforeEach(() => {
    cuentacorrienteModule = new CuentacorrienteModule();
  });

  it('should create an instance', () => {
    expect(cuentacorrienteModule).toBeTruthy();
  });
});
