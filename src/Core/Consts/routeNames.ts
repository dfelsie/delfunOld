const BACKEND_ROUTE = "http://localhost:5000/api/";
export const LOGOUT_ROUTE = BACKEND_ROUTE + "auth/logout";
export const LOGIN_ROUTE = BACKEND_ROUTE + "auth/login";
export const REGISTER_ROUTE = BACKEND_ROUTE + "auth/register";
export const GET_CURRENT_USER_ROUTE = BACKEND_ROUTE + "auth/getCurrentUser";
export const LOGGED_IN_ROUTE = BACKEND_ROUTE + "auth/loggedin";
export const BUY_OR_SELL_ROUTE = BACKEND_ROUTE + "transaction/buyorsell";
export const GET_CURRENT_USER_DATA_ROUTE =
  BACKEND_ROUTE + "data/getcurruserdata";
export const GET_PAST_PORTFOLIO_VALUE_ROUTE =
  BACKEND_ROUTE + "data/getpastportfoliovals/";
