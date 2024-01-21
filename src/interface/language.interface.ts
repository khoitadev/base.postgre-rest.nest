import { Status } from '~/enum';

export interface Language extends Document {
  readonly name: string;
  readonly locale: string;
  readonly image?: string;
  readonly sort: number;
  readonly status: Status;
}
