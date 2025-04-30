/**
 * api list
 */
const ApiList = {
  Socket: null,
  SignIn: 'users/signin',
  SignUp: 'users/signup',
  ResetPassword: 'users/signup',
  Confirm: 'users/confirmVerifyCode',
  userInfo: 'users/',

  LoadMarkets: 'dex/symbols',
  LoadExchangeInfo: 'dex/exchangeInfo',
  LoadOrderListV2: 'dex/orderListV2',
  LoadLatestOrders: 'dex/latestOrders',
  LoadTokenList: 'dex/LoadtokenList',
  LoadMyOrders: 'dex/LoadMyOrders',
  LoadCurrentOrders: 'dex/LoadCurrentOrders',
  BuyAndSellByContract: 'dex/buyandSell',
  CancelOrder: 'dex/cancel',
  Withdraw: 'dex/withdraw',
  
  LoadAccountAssets: 'wallet/getAccount',
  LoadPrice: 'wallet/getPrice',

  OTCAPI: 'otc/',
  LoadMyOTCList: 'otc/getOtc',
  currencies: "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/",

  LoadContacts: 'message/getContacts',
  LoadLanguageWord: 'languageWord',
  LoadLanguage: 'language',
  
  LoadTraderList: 'copyTrade/traderlist',
  CopyTrade: 'copyTrade',
  FileUpload: 'files',
  GetSupport: 'chat/getSupport',
  GetMessage: 'chat/',
  
  IDVerification: 'idVerification',
}

const dev = {
  BACKEND_URL: "http://192.168.114.37:3333/",
  IMAGE_URL: "http://192.168.114.37:3333/",
  ...ApiList
}

const pro = {
  BACKEND_URL: "http://173.209.37.82/",
  IMAGE_URL: "http://173.209.37.82/",
  ...ApiList
}

export const ROOT = pro


