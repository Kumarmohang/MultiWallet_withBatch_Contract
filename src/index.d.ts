import { AxiosRequestConfig } from "axios";
export type ApiState = {
  loading: boolean;
  isError: boolean;
  error?: object | null;
  flag: boolean;
  data?: object | null;
};

export interface ApiConfig {
  [key: string]: AxiosRequestConfig;
}
export interface DataTypeForList {
  name?: string;
  imageUrl?: string;
  id: string;
  customDirectoryIdentifier: string;
  startDate: string;
  endDate: string;
  createAt: string;
  status?: string;
  updatedAt?: string;
  merchant?: any;
  statistics: {
    invoiceCount: number;
    paidInvoices: number;
    pendingInvoices: number;
    approvedInvoices: number;
  };
}

export interface DataTypeForDirectoryDetail {
  name?: string;
  customDirectoryIdentifier: string;
  startDate: string;
  endDate: string;
  directoryId?: string;
  totalInvoices: number;
}
export interface ApiKeyData {
  api_key?: string;
}

export interface DataTypeForProjectInvoices {
  id: string;
  customInvoiceIdentifier: string;
  customDirectoryIdentifier?: string;
  projectId?: string;
  merchantId?: string;
  creationDate: string;
  from: string;
  to?: string | null;
  createdAt?: string;
  updatedAt?: string;
  tokenSymbol?: string;
  tokenId?: string;
  tokenName?: string;
  totalAmount?: number | null;
  blockChainId?: string;
  finalPaymentAmonut?: number | null;
  finalPaymentCurrency?: number | null;
  allowedPaymentCurrency?: number | null;
  destinationPublicAddress: string;
  status: string;
  isDeleted?: boolean;
  transactionId?: string;
  memo?: string;
  payer: {
    email: string;
    payerText: string;
  };
  tags?: string[];
  extraData?: {
    keyName: string;
    value: string;
  }[];
}

export interface DummyApiConfig {
  [key: string]: {
    url?: any;
    method?: Method | string;
    data?: object;
  };
}

export interface DummyApiResponse {
  data?: any;
}
export interface TabItemForProject {
  label: string;
  key: string;
  path?: string;
  routeName: string;
  status: string;
}
export interface TabItemForProjectList {
  label: string;
  key: string;
  path?: string;
  routeName: string;
  status?: string;
}
export interface FinalInvoiceDataType {
  customInvoiceIdentifier: number;
  payer: string;
  destinationPublicAddress: string;
  totalAmount: number;
  tokenName: string;
}

export type ErrorState = {
  isError: boolean;
  error: AxiosError | Error | null;
};

export type updateStatusBody = {
  directoryId: string;
  invoiceIds: string[];
  status: string;
};

export interface TransactionMetadata {
  id: string;
  createdAt: string;
  status: "initiated" | "complete" | "failed" | "pending";
  callerAddress: string;
  txHash?: string;
}

export interface ListHeader {
  title: string;
  span?: number;
  align?:
    | "center"
    | "end"
    | "justify"
    | "left"
    | "match-parent"
    | "right"
    | "start";
  key: string;
  customClass?: string;
}

export interface TransactionDetailResponse {
  invoiceCount: number;
  transaction: TransactionMetadata;
}

interface TokenDetails {
  tokenSmartContractAddress: string;
  utilityContracts: string[];
  blockchainName: string;
  chainId: number;
}

export interface TransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  root?: string;
  gasUsed: BigNumber;
  logsBloom: string;
  blockHash: string;
  transactionHash: string;
  logs: Array<Log>;
  blockNumber: number;
  confirmations: number;
  cumulativeGasUsed: BigNumber;
  effectiveGasPrice: BigNumber;
  byzantium: boolean;
  type: number;
  status?: number;
}
