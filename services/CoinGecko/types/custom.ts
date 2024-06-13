import { z } from "zod";

export const SimpleDailyHistoricPriceResponseSchema = z.object({
  time: z.number(),
  price: z.number(),
});

export const SimplePriceResponseSchema = z.record(z.record(z.number()));

export const SimpleDailyHistoricPriceParamsSchema = z.object({
  id: z.string(),
  vs_currency: z.string(),
  date: z.string(),
});

export const SimplePriceParamsSchema = z.object({
  ids: z.string(),
  vs_currencies: z.string(),
  include_market_cap: z.string().optional(),
  include_24hr_vol: z.string().optional(),
  include_24hr_change: z.string().optional(),
  include_last_updated_at: z.string().optional(),
  precision: z.string().optional(),
});

export type SimplePriceResponse = z.infer<typeof SimplePriceResponseSchema>;
export type SimpleDailyHistoricPriceParams = z.infer<
  typeof SimpleDailyHistoricPriceParamsSchema
>;
export type SimplePriceParams = z.infer<typeof SimplePriceParamsSchema>;
export type SimpleDailyHistoricPriceResponse = z.infer<
  typeof SimpleDailyHistoricPriceResponseSchema
>;
