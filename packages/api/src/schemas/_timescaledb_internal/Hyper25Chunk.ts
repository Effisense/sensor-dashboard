// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { z } from 'zod';

/** Represents the table _timescaledb_internal._hyper_2_5_chunk */
export default interface Hyper25Chunk {
  time: Date;

  symbol: string;

  price: number | null;

  day_volume: number | null;
}

/** Represents the initializer for the table _timescaledb_internal._hyper_2_5_chunk */
export interface Hyper25ChunkInitializer {
  time: Date;

  symbol: string;

  price?: number | null;

  day_volume?: number | null;
}

/** Represents the mutator for the table _timescaledb_internal._hyper_2_5_chunk */
export interface Hyper25ChunkMutator {
  time?: Date;

  symbol?: string;

  price?: number | null;

  day_volume?: number | null;
}

/** Zod schema for _hyper_2_5_chunk */
export const hyper25Chunk = z.object({
  time: z.date(),
  symbol: z.string(),
  price: z.number(),
  day_volume: z.number(),
});
