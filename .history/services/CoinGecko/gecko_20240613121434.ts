/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import { geckoSupportedVSCurrencies } from './constants';

// TODO: pre-set vs currencies and supported currencies match to save on API stuff
export class CoinGeckoClient {
	private baseURL: string;
	private apiKey: string;
	public supportedVSCurrencies: string[];
	public supportedCoinsMap: Record<string, string>;
	public supportedCoins: CoinGecko.api.CoinsListResponse[] = [];
	public cacheControl: {
		getSupportedVSCurrencies: { called: Date | undefined };
		getAllCoins: { called: Date | undefined };
	} = {
		getSupportedVSCurrencies: { called: undefined },
		getAllCoins: { called: undefined },
	};

	constructor(config?: { baseURL?: string; apiKey?: string }) {
		this.baseURL = config?.baseURL ?? 'https://pro-api.coingecko.com/api/v3';
		this.apiKey = config?.apiKey ?? '';
		this.supportedVSCurrencies = geckoSupportedVSCurrencies;
		this.supportedCoinsMap = {};
	}

	private async fetchData<T>(url: string, params?: Record<string, any>): Promise<Result<T, Error>> {
		const searchParams = new URLSearchParams(params);
		const requestUrl = `${this.baseURL}${url}?${searchParams.toString()}`;
		try {
			const response = await fetch(requestUrl, {
				headers: {
					'x-cg-pro-api-key': this.apiKey,
					Accept: '*/*',
				},
			});

			if (!response.ok) {
				throw new Error(
					`Request failed with status ${response.status}: ${
						response.statusText
					}\n${await response.text()}`,
				);
			}

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const data: T = await response.json();
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return Ok(data);
		} catch (error) {
			return new Err(error as Error);
		}
	}

	async getSimpleTokenPrice(
		params: CoinGecko.custom.SimplePriceParams,
	): Promise<Result<CoinGecko.custom.SimplePriceResponse, Error>> {
		return this.fetchData<CoinGecko.custom.SimplePriceResponse>('/simple/price', params);
	}

	async getHistoricalChartApiData(
		params: CoinGecko.api.HistoricalChartDataParams,
	): Promise<Result<CoinGecko.api.HistoricalChartDataResponse, Error>> {
		const {
			id: coinId,
			from: fromDateInt,
			to: toDateInt,
			vs_currency,
			interval,
			precision,
		} = params;
		const reqParams = {
			vs_currency,
			from: fromDateInt,
			to: toDateInt,
			interval,
			precision,
		};
		try {
			const response = await this.fetchData<CoinGecko.api.HistoricalChartDataResponse>(
				`/coins/${coinId}/market_chart/range`,
				reqParams,
			);
			if (response.ok) {
				console.log(
					`(req succeeded) CoinGecko Historical Chart Data: ${JSON.stringify(response.val)}`,
				);
				return response;
			} else {
				console.log(
					`(req failed) CoinGecko Historical Chart Response: ${JSON.stringify(response.val)}`,
				);
				return new Err(response.val as Error);
			}
		} catch (error) {
			return new Err(error as Error);
		}
	}

	async getSimpleHistoricalTokenPrice(
		args: CoinGecko.custom.SimpleDailyHistoricPriceParams,
	): Promise<Result<CoinGecko.custom.SimpleDailyHistoricPriceResponse, Error>> {
		const { id: coinId, date: dateString, vs_currency } = args;

		try {
			const parsedDate = new Date(dateString);
			const from = Math.floor(parsedDate.getTime() / 1000);
			const params = { vs_currency, from, to: from + 86401, interval: 'daily' };

			const response = await this.fetchData<{ prices: [number, number][] }>(
				`/coins/${coinId}/market_chart/range`,
				params,
			);

			if (response.ok) {
				const prices = response.val.prices;
				if (!prices || prices.length === 0) {
					return new Err(
						new Error(
							`No prices found for ${coinId} on ${dateString}: ${JSON.stringify(response.val)}`,
						),
					);
				}
				const [time, price] = prices[0] ?? [];
				if (!price || !time) {
					return new Err(
						new Error(
							`No price found for ${coinId} on ${dateString}: ${JSON.stringify(response.val)}`,
						),
					);
				}
				return Ok({ price, time });
			} else {
				return new Err(new Error(`Failed to fetch data: ${(response.val as Error).message}`));
			}
		} catch (error) {
			return new Err(error as Error);
		}
	}

	async getSupportedVSCurrencies(): Promise<Result<string[], Error>> {
		if (this.cacheControl.getSupportedVSCurrencies.called) {
			return Ok(this.supportedVSCurrencies);
		}

		const response = await this.fetchData<string[]>('/simple/supported_vs_currencies');
		if (response.ok) {
			this.supportedVSCurrencies = response.val;
			this.cacheControl.getSupportedVSCurrencies.called = new Date();
		}

		return response;
	}

	async getAllCoins(params?: {
		include_platform: boolean;
	}): Promise<Result<CoinGecko.api.CoinsListResponse[], Error>> {
		if (this.cacheControl.getAllCoins.called) {
			return Ok(this.supportedCoins);
		}

		const response = await this.fetchData<CoinGecko.api.CoinsListResponse[]>('/coins/list', params);
		if (response.ok) {
			this.supportedCoins = response.val;
			this.supportedCoinsMap = response.val.reduce((acc, coin) => {
				acc[coin.symbol] = coin.id;
				return acc;
			}, {} as Record<string, string>);
			this.cacheControl.getAllCoins.called = new Date();
		}

		return response;
	}

	async getCoinData(
		coinID: string,
		params?: {
			localization?: string;
			tickers?: boolean;
			market_data?: boolean;
			community_data?: boolean;
			developer_data?: boolean;
			sparkline?: boolean;
		},
	): Promise<Result<CoinGecko.api.CoinDataResponse, Error>> {
		return this.fetchData<CoinGecko.api.CoinDataResponse>(`/coins/${coinID}`, params);
	}

	async getEZTokenPrice(
		tokenISOCode: string,
		params?: { versus?: string; dateTime?: string | Date },
	): Promise<Result<number, Error>> {
		const vs = params?.versus ? params.versus.toLowerCase() : 'usd';
		if (!geckoSupportedVSCurrencies.includes(vs)) {
			const response = await this.getSupportedVSCurrencies();
			if (response.ok && !response.val.includes(vs)) {
				return new Err(new Error(`Token versus symbol '${vs}' is not supported`));
			}
		}

		const token = tokenISOCode.toLowerCase();
		const coinID = this.supportedCoinsMap[token];
		if (!coinID) {
			return new Err(
				new Error(`Token price requested symbol '${tokenISOCode}' is not whitelisted`),
			);
		}

		if (params?.dateTime) {
			const priceResult = await this.getSimpleHistoricalTokenPrice({
				id: coinID,
				vs_currency: vs,
				date: params.dateTime.toString(),
			});
			if (priceResult.ok) {
				return Ok(priceResult.val.price);
			}
			return new Err(
				new Error(
					`Failed to fetch historical price for '${tokenISOCode}' on date '${params.dateTime.toString()}'`,
				),
			);
		}

		const priceResult = await this.getSimpleTokenPrice({
			ids: coinID,
			vs_currencies: vs,
		});
		if (priceResult.ok) {
			const data = priceResult.val[coinID];
			if (!data) {
				return new Err(new Error(`Failed to fetch the price for '${tokenISOCode}'`));
			}
			const res = data[vs];
			if (!res) {
				return new Err(
					new Error(
						`Failed to fetch the price for '${tokenISOCode}' against '${vs}', '${vs}' not found in resp`,
					),
				);
			}
			return Ok(res);
		}

		return new Err(new Error(`Failed to fetch the price for '${tokenISOCode}'`));
	}
}
