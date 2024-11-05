export class CalculationFormData {
  id: number = 0;
  region: string = ''
  customerType: string = ''
  roofType: string = ''
  roofSurface: string = ''
  installationType: string = ''
  energyConsumptionPerYear: number = 0
  expectedPvPower: number = 0
  projoy: boolean = false;
  fireButton: boolean = false;
  powerOptimizersType: string = "";
  energyStorageModelId: number = 0;
  hasGrant: boolean = false;
}
