import { z } from "zod";

export const PlatformsSchema = z.record(z.string());

export const GeneratedTypeSchema = z.object({
  decimal_place: z.any(),
  contract_address: z.string(),
});

export const DetailPlatformsSchema = z.record(GeneratedTypeSchema);

export const LocalizationSchema = z.record(z.any());

export const DescriptionSchema = z.record(z.any());

export const ReposUrlSchema = z.object({
  github: z.array(z.string()),
  bitbucket: z.array(z.any()),
});

export const LinksSchema = z.object({
  homepage: z.array(z.string()),
  blockchain_site: z.array(z.string()),
  official_forum_url: z.array(z.string()),
  chat_url: z.array(z.string()),
  announcement_url: z.array(z.string()),
  twitter_screen_name: z.string(),
  facebook_username: z.string(),
  bitcointalk_thread_identifier: z.any(),
  telegram_channel_identifier: z.string(),
  subreddit_url: z.string(),
  repos_url: ReposUrlSchema,
});

export const ImageSchema = z.object({
  thumb: z.string(),
  small: z.string(),
  large: z.string(),
});

export const Links2Schema = z.any();

export const IcoDataSchema = z.object({
  ico_start_date: z.string(),
  ico_end_date: z.string(),
  short_desc: z.string(),
  description: z.any(),
  links: Links2Schema,
  softcap_currency: z.string(),
  hardcap_currency: z.string(),
  total_raised_currency: z.string(),
  softcap_amount: z.any(),
  hardcap_amount: z.any(),
  total_raised: z.any(),
  quote_pre_sale_currency: z.string(),
  base_pre_sale_amount: z.any(),
  quote_pre_sale_amount: z.any(),
  quote_public_sale_currency: z.string(),
  base_public_sale_amount: z.number(),
  quote_public_sale_amount: z.number(),
  accepting_currencies: z.string(),
  country_origin: z.string(),
  pre_sale_start_date: z.any(),
  pre_sale_end_date: z.any(),
  whitelist_url: z.string(),
  whitelist_start_date: z.any(),
  whitelist_end_date: z.any(),
  bounty_detail_url: z.string(),
  amount_for_sale: z.any(),
  kyc_required: z.boolean(),
  whitelist_available: z.any(),
  pre_sale_available: z.any(),
  pre_sale_ended: z.boolean(),
});

export const CurrentPriceSchema = z.record(z.any());

export const RoiSchema = z.object({
  times: z.number(),
  currency: z.string(),
  percentage: z.number(),
});

export const MarketDataSchema = z.object({
  current_price: CurrentPriceSchema,
  total_value_locked: z.any(),
  mcap_to_tvl_ratio: z.any(),
  fdv_to_tvl_ratio: z.any(),
  roi: RoiSchema,
  ath: z.record(z.any()),
  ath_change_percentage: z.record(z.any()),
  ath_date: z.record(z.any()),
  atl: z.record(z.any()),
  atl_change_percentage: z.record(z.any()),
  atl_date: z.record(z.any()),
  market_cap: z.record(z.any()),
  market_cap_rank: z.number(),
  fully_diluted_valuation: z.record(z.any()),
  total_volume: z.record(z.any()),
  low_24h: z.record(z.any()),
  price_change_24h: z.number(),
  price_change_percentage_24h: z.number(),
  price_change_percentage_7d: z.number(),
  price_change_percentage_14d: z.number(),
  price_change_percentage_30d: z.number(),
  price_change_percentage_60d: z.number(),
  price_change_percentage_200d: z.number(),
  price_change_percentage_1y: z.number(),
  market_cap_change_24h: z.number(),
  market_cap_change_percentage_24h: z.number(),
  price_change_24h_in_currency: z.record(z.any()),
  price_change_percentage_1h_in_currency: z.record(z.any()),
  price_change_percentage_24h_in_currency: z.record(z.any()),
  price_change_percentage_7d_in_currency: z.record(z.any()),
  price_change_percentage_14d_in_currency: z.record(z.any()),
  price_change_percentage_30d_in_currency: z.record(z.any()),
  price_change_percentage_60d_in_currency: z.record(z.any()),
  price_change_percentage_200d_in_currency: z.record(z.any()),
  price_change_percentage_1y_in_currency: z.record(z.any()),
  market_cap_change_24h_in_currency: z.record(z.any()),
  market_cap_change_percentage_24h_in_currency: z.record(z.any()),
  total_supply: z.number(),
  max_supply: z.any(),
  circulating_supply: z.number(),
  last_updated: z.string(),
});

export const CommunityDataSchema = z.object({
  facebook_likes: z.any(),
  twitter_followers: z.number(),
  reddit_average_posts_48h: z.number(),
  reddit_average_comments_48h: z.number(),
  reddit_subscribers: z.number(),
  reddit_accounts_active_48h: z.number(),
  telegram_channel_user_count: z.any(),
});

export const CodeAdditionsDeletions4WeeksSchema = z.object({
  additions: z.number(),
  deletions: z.number(),
});

export const DeveloperDataSchema = z.object({
  forks: z.number(),
  stars: z.number(),
  subscribers: z.number(),
  total_issues: z.number(),
  closed_issues: z.number(),
  pull_requests_merged: z.number(),
  pull_request_contributors: z.number(),
  code_additions_deletions_4_weeks: CodeAdditionsDeletions4WeeksSchema,
  commit_count_4_weeks: z.number(),
  last_4_weeks_commit_activity_series: z.array(z.number()),
});

export const PublicInterestStatsSchema = z.object({
  alexa_rank: z.number(),
  bing_matches: z.any(),
});

export const MarketSchema = z.object({
  name: z.string(),
  identifier: z.string(),
  has_trading_incentive: z.boolean(),
});

export const ConvertedLastSchema = z.record(z.number());

export const ConvertedVolumeSchema = z.record(z.number());

export const geckoSupportedVSCurrencies = z.array(
  z.union([
    z.literal("btc"),
    z.literal("eth"),
    z.literal("ltc"),
    z.literal("bch"),
    z.literal("bnb"),
    z.literal("eos"),
    z.literal("xrp"),
    z.literal("xlm"),
    z.literal("link"),
    z.literal("dot"),
    z.literal("yfi"),
    z.literal("usd"),
    z.literal("aed"),
    z.literal("ars"),
    z.literal("aud"),
    z.literal("bdt"),
    z.literal("bhd"),
    z.literal("bmd"),
    z.literal("brl"),
    z.literal("cad"),
    z.literal("chf"),
    z.literal("clp"),
    z.literal("cny"),
    z.literal("czk"),
    z.literal("dkk"),
    z.literal("eur"),
    z.literal("gbp"),
    z.literal("hkd"),
    z.literal("huf"),
    z.literal("idr"),
    z.literal("ils"),
    z.literal("inr"),
    z.literal("jpy"),
    z.literal("krw"),
    z.literal("kwd"),
    z.literal("lkr"),
    z.literal("mmk"),
    z.literal("mxn"),
    z.literal("myr"),
    z.literal("ngn"),
    z.literal("nok"),
    z.literal("nzd"),
    z.literal("php"),
    z.literal("pkr"),
    z.literal("pln"),
    z.literal("rub"),
    z.literal("sar"),
    z.literal("sek"),
    z.literal("sgd"),
    z.literal("thb"),
    z.literal("try"),
    z.literal("twd"),
    z.literal("uah"),
    z.literal("vef"),
    z.literal("vnd"),
    z.literal("zar"),
    z.literal("xdr"),
    z.literal("xag"),
    z.literal("xau"),
    z.literal("bits"),
    z.literal("sats"),
  ]),
);

export const TickerSchema = z.object({
  base: z.string(),
  target: z.string(),
  market: MarketSchema,
  last: z.number(),
  volume: z.number(),
  converted_last: ConvertedLastSchema,
  converted_volume: ConvertedVolumeSchema,
  trust_score: z.string(),
  bid_ask_spread_percentage: z.number(),
  timestamp: z.string(),
  last_traded_at: z.string(),
  last_fetch_at: z.string(),
  is_anomaly: z.boolean(),
  is_stale: z.boolean(),
  trade_url: z.string().optional(),
  token_info_url: z.any(),
  coin_id: z.string(),
  target_coin_id: z.string().optional(),
});

export const CoinDataResponseSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  asset_platform_id: z.any(),
  platforms: z.record(z.string()),
  detail_platforms: z.record(GeneratedTypeSchema),
  block_time_in_minutes: z.number(),
  hashing_algorithm: z.string(),
  categories: z.array(z.string()),
  public_notice: z.any(),
  additional_notices: z.array(z.any()),
  localization: z.record(z.any()),
  description: z.record(z.any()),
  links: LinksSchema,
  image: ImageSchema,
  country_origin: z.string(),
  genesis_date: z.string(),
  sentiment_votes_up_percentage: z.number(),
  sentiment_votes_down_percentage: z.number(),
  ico_data: IcoDataSchema,
  watchlist_portfolio_users: z.number(),
  market_cap_rank: z.number(),
  coingecko_rank: z.number(),
  coingecko_score: z.number(),
  developer_score: z.number(),
  community_score: z.number(),
  liquidity_score: z.number(),
  public_interest_score: z.number(),
  market_data: MarketDataSchema,
  community_data: CommunityDataSchema,
  developer_data: DeveloperDataSchema,
  public_interest_stats: PublicInterestStatsSchema,
  status_updates: z.array(z.any()),
  last_updated: z.string(),
  tickers: z.array(TickerSchema),
});

export const CoinsListResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(),
});

export const HistoricalChartDataResponseSchema = z.object({
  prices: z.array(z.tuple([z.number(), z.number()])),
  market_caps: z.array(z.tuple([z.number(), z.number()])),
  total_volumes: z.array(z.tuple([z.number(), z.number()])),
});

export const HistoricalChartDataParamsSchema = z.object({
  id: z.string(),
  vs_currency: z.string(),
  from: z.number(),
  to: z.number(),
  interval: z.string().optional(),
  precision: z.string().optional(),
});

export type HistoricalChartDataResponse = z.infer<
  typeof HistoricalChartDataResponseSchema
>;
export type HistoricalChartDataParams = z.infer<
  typeof HistoricalChartDataParamsSchema
>;

export type CoinsListResponse = z.infer<typeof CoinsListResponseSchema>;

export type CoinDataResponse = z.infer<typeof CoinDataResponseSchema>;
export type Platforms = z.infer<typeof PlatformsSchema>;
export type DetailPlatforms = z.infer<typeof DetailPlatformsSchema>;
export type GeneratedType = z.infer<typeof GeneratedTypeSchema>;
export type Localization = z.infer<typeof LocalizationSchema>;
export type Description = z.infer<typeof DescriptionSchema>;
export type Links = z.infer<typeof LinksSchema>;
export type ReposUrl = z.infer<typeof ReposUrlSchema>;
export type Image = z.infer<typeof ImageSchema>;
export type IcoData = z.infer<typeof IcoDataSchema>;
export type Links2 = z.infer<typeof Links2Schema>;
export type MarketData = z.infer<typeof MarketDataSchema>;
export type CurrentPrice = z.infer<typeof CurrentPriceSchema>;
export type Roi = z.infer<typeof RoiSchema>;
export type CommunityData = z.infer<typeof CommunityDataSchema>;
export type DeveloperData = z.infer<typeof DeveloperDataSchema>;
export type CodeAdditionsDeletions4Weeks = z.infer<
  typeof CodeAdditionsDeletions4WeeksSchema
>;
export type PublicInterestStats = z.infer<typeof PublicInterestStatsSchema>;
export type Ticker = z.infer<typeof TickerSchema>;
export type Market = z.infer<typeof MarketSchema>;
export type ConvertedLast = z.infer<typeof ConvertedLastSchema>;
export type ConvertedVolume = z.infer<typeof ConvertedVolumeSchema>;
