import { model, Schema } from 'mongoose';

interface ICat {
  name: string;
  weight: number | string;
  age: number | string;
  breed: string;
}

const catSchema = new Schema<ICat>({
  name: String,
  weight: { type: Schema.Types.Mixed },
  age: { type: Schema.Types.Mixed },
  breed: String
});

const Cat = model<ICat>('Cat', catSchema);

export type { ICat };
export default Cat;
