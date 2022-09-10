import axios from 'axios';
import dotenv from 'dotenv';
import { BaseError } from 'errors';

dotenv.config();

export interface DartQuery {
  name: string,
  last_name: string,
  cache_date: string,
  suffix: string,
  first_name: string,
  netid: string,
  email: string,
  prefix: string,
  middle_name: string,
  campus_address: string,
}

export interface DartParams {
  first_name: string,
  middle_name: string,
  last_name: string,
  jwt: string,
}

const getDartJWT = async () => {
  try {
    const URL = 'https://api.dartmouth.edu/api/jwt?';
    const HEADERS = {
      headers: {
        Authorization: `${process.env.DARTAPI}`,
      },
    };
  
    const res = await axios.post(URL, {}, HEADERS);
    return res.data.jwt;
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

// Note - max 1000 rows returned on any query
const getDartUsers = async (params: DartParams) => {
  try {
    const URL = `https://api.dartmouth.edu/api/people?affilitations.name=Student&first_name=${params.first_name}*&middle_name=${params.middle_name}*&last_name=${params.last_name}*`;
    const HEADERS = {
      headers: {
        Authorization: `Bearer ${params.jwt}`,
      },
    };

    const res = await axios.get<DartQuery>(URL, HEADERS);
    return res.data;
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const dartService = {
  getDartJWT,
  getDartUsers,
};

export default dartService;
