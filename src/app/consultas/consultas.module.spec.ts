import { ConsultasModule } from './consultas.module';

describe('ConsultasModule', () => {
  let consultasModule: ConsultasModule;

  beforeEach(() => {
    consultasModule = new ConsultasModule();
  });

  it('should create an instance', () => {
    expect(consultasModule).toBeTruthy();
  });
});
