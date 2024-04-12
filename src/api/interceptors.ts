import { constants } from "@/services";
import axios, { CreateAxiosDefaults } from "axios";

const options: CreateAxiosDefaults = {
  baseURL: constants.BASE_URL,
};

const axiosBase = axios.create(options);

export { axiosBase };
