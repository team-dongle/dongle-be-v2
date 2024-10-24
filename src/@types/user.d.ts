interface IUser extends IModel {
  username: string;
  password: string;
  role: "CLUB" | "ADMIN";
  club: number | null;
}
