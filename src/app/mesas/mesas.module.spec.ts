import { MesasModule } from './mesas.module';

describe('MesasModule', () => {
  let mesasModule: MesasModule;

  beforeEach(() => {
    mesasModule = new MesasModule();
  });

  it('should create an instance', () => {
    expect(mesasModule).toBeTruthy();
  });
});
