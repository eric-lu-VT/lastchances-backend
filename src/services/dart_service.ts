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

export interface DartEmailParams {
  email: string,
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

    const res = await axios.get<DartQuery[]>(URL, HEADERS);
    return res.data;
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const getDartUserFromEmail = async (params: DartEmailParams) => {
  try {
    const URL = `https://api.dartmouth.edu/api/people?email=${params.email}*`;
    const HEADERS = {
      headers: {
        Authorization: `Bearer ${params.jwt}`,
      },
    };

    const res = await axios.get<DartQuery[]>(URL, HEADERS);
    if (res.data.length === 0) {
      throw new BaseError('Invalid email: must be (non netid) Dartmouth email', 412);
    } else if (res.data.length > 1) {
      throw new BaseError('More than one user contains specified Dartmouth email', 409);
    }

    return res.data[0];
  } catch (e: any) {
    if (e.code) {
      throw e;
    }
    throw new BaseError(e.message, 500);
  }
};

const dartService = {
  getDartJWT,
  getDartUsers,
  getDartUserFromEmail,
};

export default dartService;
