import { Status } from '~/enum';

export interface Admin {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: string[];
  readonly status: Status;
}
