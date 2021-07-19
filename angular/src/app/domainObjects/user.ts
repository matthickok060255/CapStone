export class User {
  id!: string;
  username!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  token!: string;
  voteCount: number = 0;
  isEliminated: boolean = false;
  role!: string;
}
