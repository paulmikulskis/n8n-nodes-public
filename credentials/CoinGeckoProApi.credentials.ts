import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from "n8n-workflow";

export class CoinGeckoProApi implements ICredentialType {
  name = "coinGeckoProApi";
  displayName = "CoinGecko Pro API";
  documentationUrl =
    "https://support.coingecko.com/hc/en-us/articles/6473057867161-Where-can-I-find-my-API-key";
  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
						typeOptions: { password: true },
      default: "",
      description: "The API key for accessing CoinGecko Pro API",
    },
    {
      displayName: "Domain",
      name: "domain",
      type: "string",
      default: "https://pro-api.coingecko.com",
      description: "The base URL for the CoinGecko Pro API",
    },
  ];

  // This allows the credential to be used by other parts of n8n
  // stating how this credential is injected as part of the request
  // An example is the Http Request node that can make generic calls
  // reusing this credential
  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: {
        "x-cg-pro-api-key": "={{$credentials.apiKey}}",
      },
    },
  };

  // The block below tells how this credential can be tested
  test: ICredentialTestRequest = {
    request: {
      baseURL: "={{$credentials.domain}}",
      url: "/api/v3/ping",
    },
  };
}
