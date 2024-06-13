import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { coinGecko } from '../../services';

export class CGChartHistory implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Gecko Chart History',
		name: 'cgChartHistory',
		icon: 'file:yt.svg',
		group: ['transform'],
		version: 1,
		description: 'Fetches historical chart data from CoinGecko',
		defaults: {
			name: 'CGChartHistory',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'coinGeckoProApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Coin ID',
				name: 'coinId',
				type: 'string',
				default: '',
				description: 'The ID of the coin to fetch data for',
				required: true,
			},
			{
				displayName: 'VS Currency',
				name: 'vsCurrency',
				type: 'string',
				default: 'usd',
				description: 'The target currency of market data',
				required: true,
			},
			{
				displayName: 'From (Timestamp)',
				name: 'from',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: Math.floor((new Date().getTime() - 24 * 7 * 60 * 60 * 1000) / 1000),
				description: 'The starting date in UNIX timestamp',
				displayOptions: {
					show: {
						'/useTimeUnit': [false],
					},
				},
			},
			{
				displayName: 'Use Easy Time Units',
				name: 'useTimeUnit',
				type: 'boolean',
				default: true,
				description: 'Whether to use a more user-friendly time input',
			},
			{
				displayName: 'From Date (Time Unit)',
				name: 'timeUnit',
				type: 'options',
				options: [
					{
						name: 'Hours',
						value: 'hours',
					},
					{
						name: 'Days',
						value: 'days',
					},
				],
				default: 'days',
				description: "The time unit to use for the 'from' input",
				displayOptions: {
					show: {
						useTimeUnit: [true],
					},
				},
			},
			{
				displayName: 'From Date (Time Amount)',
				name: 'timeValue',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 7,
				description: 'The value for the selected time unit',
				displayOptions: {
					show: {
						useTimeUnit: [true],
					},
				},
			},
			{
				displayName: 'Use Latest Date',
				name: 'useLatest',
				type: 'boolean',
				default: true,
				description: 'Whether to use the latest date available',
			},
			{
				displayName: 'To Date',
				name: 'to',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: Math.floor(new Date().getTime() / 1000),
				},
				default: Math.floor(new Date().getTime() / 1000),
				description: 'The ending date in UNIX timestamp, defaults to NOW',
				displayOptions: {
					show: {
						useLatest: [false],
					},
				},
				required: true,
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'options',
				options: [
					{
						name: 'Auto',
						value: '',
					},
					{
						name: '5 Minutes',
						value: '5m',
					},
					{
						name: 'Hourly',
						value: 'hourly',
					},
					{
						name: 'Daily',
						value: 'daily',
					},
				],
				default: '',
				description: 'The data interval for the request',
			},
			{
				displayName: 'Precision',
				name: 'precision',
				type: 'string',
				default: '',
				description: 'Decimal place for currency price value',
			},
			{
				name: 'helpNotice',
				type: 'notice',
				default: '',
				description: 'Help text for the node',
				displayName: `
        <strong>Output Description:</strong><br/>
        The output of this node includes three arrays: <br/>
        <strong>Prices:</strong> An array of tuples where each tuple contains a timestamp and the price of the coin at that time.<br/>
        <strong>Market Caps:</strong> An array of tuples where each tuple contains a timestamp and the market cap of the coin at that time.<br/>
        <strong>Total Volumes:</strong> An array of tuples where each tuple contains a timestamp and the total volume of the coin traded at that time.<br/>
        Example output:<br/>
        <pre>
        {
          "prices": [
            [timestamp, price],
            ...
          ],
          "market_caps": [
            [timestamp, marketCap],
            ...
          ],
          "total_volumes": [
            [timestamp, volume],
            ...
          ]
        }
        </pre>
      `,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const credentials = await this.getCredentials('coinGeckoProApi');

		if (!credentials) {
			throw new NodeOperationError(this.getNode(), 'No credentials returned!');
		}

		const geckoClient = new coinGecko.CoinGeckoClient({
			apiKey: credentials.apiKey as string,
		});

		for (let i = 0; i < items.length; i++) {
			const coinId = this.getNodeParameter('coinId', i) as string;
			const vsCurrency = this.getNodeParameter('vsCurrency', i) as string;
			const useLatest = this.getNodeParameter('useLatest', i) as boolean;
			const interval = this.getNodeParameter('interval', i) as string;
			const precision = this.getNodeParameter('precision', i) as string;
			const useTimeUnit = this.getNodeParameter('useTimeUnit', i) as boolean;

			let from = 0;
			if (useTimeUnit) {
				const timeUnit = this.getNodeParameter('timeUnit', i) as string;
				const timeValue = this.getNodeParameter('timeValue', i) as number;

				const currentTime = Math.floor(new Date().getTime() / 1000);

				if (timeUnit === 'hours') {
					from = currentTime - timeValue * 60 * 60;
				} else if (timeUnit === 'days') {
					from = currentTime - timeValue * 24 * 60 * 60;
				}
			} else {
				from = this.getNodeParameter('from', i) as number;
			}

			let to: number;
			if (useLatest) {
				to = Math.floor(new Date().getTime() / 1000);
			} else {
				to = this.getNodeParameter('to', i) as number;
			}

			const params = {
				id: coinId,
				vs_currency: vsCurrency,
				from,
				to,
				interval,
				precision,
			};

			try {
				const response = await geckoClient.getHistoricalChartApiData(params);

				if (response.ok) {
					returnData.push(response.val);
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to fetch data: ${(response.val as Error).message || response.val}`,
					);
				}
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`Failed to fetch data for coin ID '${coinId}': ${error.message}`,
				);
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
