export interface Order {
  verifyingContract: string;
  direction?: number;
  erc20Token: string;
  erc20TokenAmount: number;
  erc721Token: string;
  erc721TokenId: number;
  maker: string;
  taker?: string;
  nonce: string;
  expiry: number;
  signature: any;
  fees: any[];
  erc721TokenProperties: any[];
}
