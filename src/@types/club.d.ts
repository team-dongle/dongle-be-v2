interface IClub extends IModel {
  name: string;
  contact: string;
  location: string;
  applyUrl: string;
  thumbnail?: string;
  sns?: string;
  logo?: string;
  detail: string;
  recruitPeriod?: Date;
  isRecruiting: Date;
}
