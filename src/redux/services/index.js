/**
 * services
 */
import axios from "axios"
import { ROOT } from "../../constants"

class ApiService {
  constructor() {
    axios.interceptors.request.use(
      config => {
        config.baseURL = ROOT.BACKEND_URL
        return config
      },
      error => Promise.reject(error)
    )
    axios.interceptors.response.use(
      response => response,
      error => {
        return Promise.reject(error)
      }
    )
    axios.interceptors.response.use(
      response => response,
      error => {
        return Promise.reject(error)
      }
    )
  }

  /**
   * user
   */
  SignIn(...args) {
    return axios.post(ROOT.SignIn, ...args)
  }

  SignUp(...args) {
    return axios.post(ROOT.SignUp, ...args)
  }

  ResetPassword(...args) {
    return axios.post(ROOT.ResetPassword, ...args)
  }

  UpdateUserInfo(args, id) {
    return axios.put(`${ROOT.userInfo}${id}`, args)
  }

  GetUserInfo(args) {
    return axios.get(`${ROOT.userInfo}${args}`)
  }

  Confirm(...args) {
    return axios.post(ROOT.Confirm, ...args)
  }


  /**
   * dex
   */
  LoadMarkets(...args) {
    return axios.post(ROOT.LoadMarkets, ...args)
  }

  LoadTokenList(...args) {
    return axios.post(ROOT.LoadTokenList, ...args)
  }

  LoadExchangeInfo(...args) {
    return axios.get(ROOT.LoadExchangeInfo, ...args)
  }

  LoadOrderListV2(...args) {
    return axios.post(ROOT.LoadOrderListV2, ...args)
  }

  LoadLatestOrders(...args) {
    return axios.post(ROOT.LoadLatestOrders, ...args)
  }

  LoadMyOrders(...args) {
    return axios.post(ROOT.LoadMyOrders, ...args)
  }

  LoadCurrentOrders(...args) {
    return axios.post(ROOT.LoadCurrentOrders, ...args)
  }

  BuyAndSellByContract(...args) {
    return axios.post(ROOT.BuyAndSellByContract, ...args)
  }

  CancelOrder(...args) {
    return axios.post(ROOT.CancelOrder, ...args)
  }

  Withdraw(...args) {
    return axios.post(ROOT.Withdraw, ...args)
  }

  /**
   * wallet
   */
  LoadAccountAssets(...args) {
    return axios.post(ROOT.LoadAccountAssets, ...args)
  }

  LoadPrice(...args) {
    return axios.post(ROOT.LoadPrice, ...args)
  }


  /**
   * otc
   */
  LoadOTCList(...args) {
    return axios.get(ROOT.OTCAPI, ...args)
  }

  LoadMyOTCList(...args) {
    return axios.post(ROOT.LoadMyOTCList, ...args)
  }

  CreateQuote(...args) {
    return axios.post(ROOT.OTCAPI, ...args)
  }

  DeleteQuote(id) {
    return axios.delete(`${ROOT.OTCAPI}${id}`)
  }

  /**
   * message
   */
  LoadContacts(...args) {
    return axios.post(ROOT.LoadContacts, ...args)
  }

  /**
   * language
   */
  LoadLanguageWord(...args) {
    return axios.get(ROOT.LoadLanguageWord, ...args)
  }

  LoadLanguage(...args) {
    return axios.get(ROOT.LoadLanguage, ...args)
  }

  /**
   * trader
   */
  LoadTraderList(...args) {
    return axios.post(ROOT.LoadTraderList, ...args)
  }

  CopyTrade(...args) {
    return axios.post(ROOT.CopyTrade, ...args)
  }

  Unfollow(args) {
    return axios.delete(`${ROOT.CopyTrade}/${args}`)
  }

  FileUpload(...args) {
    return axios.post(ROOT.FileUpload, ...args)
  }
  
  IDVerification(...args) {
    return axios.post(ROOT.IDVerification, ...args)
  }
  
  GetSupport(...args) {
    return axios.get(ROOT.GetSupport, ...args)
  }

  GetMessage(id, mid) {
    return axios.get(`${ROOT.GetMessage}/${id}/${mid}`)
  }
}

export const useApi = () => {
  return new ApiService()
}

export * from './navigator'