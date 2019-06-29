import { AsistenciasModule } from './asistencias.module';

describe('AsistenciasModule', () => {
  let asistenciasModule: AsistenciasModule;

  beforeEach(() => {
    asistenciasModule = new AsistenciasModule();
  });

  it('should create an instance', () => {
    expect(asistenciasModule).toBeTruthy();
  });
});
