// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { z } from 'zod';

/** Represents the table _timescaledb_internal._hyper_2_4_chunk */
export default interface Hyper24Chunk {
  time: Date;

  symbol: string;

  price: number | null;

  day_volume: number | null;
}

/** Represents the initializer for the table _timescaledb_internal._hyper_2_4_chunk */
export interface Hyper24ChunkInitializer {
  time: Date;

  symbol: string;

  price?: number | null;

  day_volume?: number | null;
}

/** Represents the mutator for the table _timescaledb_internal._hyper_2_4_chunk */
export interface Hyper24ChunkMutator {
  time?: Date;

  symbol?: string;

  price?: number | null;

  day_volume?: number | null;
}

/** Zod schema for _hyper_2_4_chunk */
export const hyper24Chunk = z.object({
  time: z.date(),
  symbol: z.string(),
  price: z.number(),
  day_volume: z.number(),
});
