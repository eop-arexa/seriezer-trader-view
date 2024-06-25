import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import * as util from 'util';
import * as _ from 'lodash';
import { IPagination } from '../pagination/pagination.interface';
import { BadRequestException } from '@nestjs/common';
import moment from 'moment-timezone';
import { exec } from 'child_process';
import config from 'config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns a random number between vMin (inclusive) and vMax (exclusive)
 * @param vMin
 * @param vMax
 */
export function getRandomValue(vMin: number, vMax: number) {
  return Math.floor(Math.random() * (vMax - vMin) + vMin);
}

export function isNullOrUndefined(value) {
  return value === null || value === undefined;
}

export function isSomeValueNullOrUndefined(values: any[]) {
  return values.some((value) => isNullOrUndefined(value));
}

export function isEmpty(obj: any): boolean {
  if (obj == null) return true;

  // Assume object has length property
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // If isn't an object, it is empty
  if (typeof obj !== 'object') return true;

  // Otherwise, does it have any properties of its own
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

export function safeToString(json: any): string {
  if (isEmpty(json)) {
    return null;
  }

  try {
    return JSON.stringify(json);
  } catch (ex) {
    return util.inspect(json);
  }
}

export function getEnumKeys<T extends string | number>(e: Record<string, T>): string[] {
  return _.difference(_.keys(e), _.map(_.filter(_.values(e), _.isNumber), _.toString));
}

export function getEnumValues<T extends string | number>(e: Record<string, T>): T[] {
  return _.values(_.pick(e, getEnumKeys(e)));
}

export const createPagination = (page: number, perPage: number): IPagination => {
  page = +page || 1;
  perPage = +perPage || 20;

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  return {
    page,
    perPage,
    startIndex,
    endIndex,
  };
};

export function isClientErrorStatus(status) {
  if (!status) {
    return false;
  }

  return status.toString().match(/^4\d{2}$/);
}

export function removeEmptyProperties(obj) {
  obj = _.pickBy(obj, (value) => !isNullOrUndefined(value));
  return obj;
}

export function getParamsFromArrayQuery(input: any) {
  if (_.isString(input)) {
    return input.split(',');
  }
  return input;
}

export function transformStringToObject(input: any) {
  let attributes = input.value;
  if (typeof attributes === 'string') {
    attributes = [attributes];
  }
  const result = [];
  for (const attr of attributes) {
    if (typeof attr === 'string') {
      try {
        result.push(JSON.parse(attr));
      } catch (e) {
        throw new BadRequestException('attributes should be json string');
      }
    } else if (typeof attr === 'object') {
      result.push(attr);
    }
  }
  return result;
}

export function transformBooleanString(input: any) {
  const booleanString = input.value;
  if (typeof booleanString === 'boolean') {
    return booleanString;
  }
  if (booleanString === 'true') {
    return true;
  }
  if (booleanString === 'false') {
    return false;
  }
  return null;
}

export const standardizeAttribute = (input) =>
  typeof input.value === 'string' ? input.value?.toLowerCase() : input.value;

export const generateEntityId = () => new Date().getTime() * 100 + Math.floor(Math.random() * (100 + 1));

export const maskCardNumber = (cardNumber: string) => {
  return cardNumber.replace(/\d(?=\d{4})/g, '*');
};

export function getDates(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const currentDate: Date = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dates.push(moment(currentDate).tz('Asia/Singapore').format('ddd DD/MM/YYYY').toString().toUpperCase());
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export function formatDate(date: moment.MomentInput, formatString = 'ddd DD/MM/YYYY'): string {
  return moment(date).tz('Asia/Singapore').format(formatString).toString().toUpperCase();
}
export function milisecondToHour(milisecond: number): number {
  return milisecond / 1000 / 60 / 60;
}

export function getMonths(startDate: Date, endDate: Date): string[] {
  const months: string[] = [];
  const currentDate: Date = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const month: string = moment(currentDate).tz('Asia/Singapore').format('MMM MM/yyyy').toString().toUpperCase();
    if (!months.includes(month)) {
      months.push(month);
    }
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return months;
}

export function generateOTP() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadius = 6371000; // Earth's radius in meters

  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  const deltaLat = lat2Rad - lat1Rad;
  const deltaLon = lon2Rad - lon1Rad;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export const isFilterHasValue = (value) => value !== false && value !== undefined && value !== null && value !== '';

export function formatAmount(amount: number): string {
  return amount.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export function formatCurrency(amount: number): string {
  return `S$ ${formatAmount(amount)}`;
}

export function formatLP(amount: number): string {
  return `${formatAmount(amount)} LP`;
}

export function findDuplicatesBy(array: Record<any, any>[], fieldName: string): number[] {
  const seenIds = new Set<number>();
  const duplicates: number[] = [];

  for (const item of array) {
    if (seenIds.has(item[fieldName])) {
      duplicates.push(item[fieldName]);
      continue;
    }
    seenIds.add(item[fieldName]);
  }

  return duplicates;
}

export function composeBlockchainOrderIdOnCampaign(orderId: number, campaignId: number) {
  return `${campaignId}${orderId}`;
}

export function execSh(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      // tslint:disable-next-line:no-console
      console.log(cmd);
      if (err) reject(err);
      if (stderr) {
        reject(stderr);
      }
      resolve(stdout);
    });
  });
}

export const getConfig = () => {
  return config;
};

export function createMongooseOptions(uri: string): MongooseModuleOptions {
  return {
    uri,
  };
}

export const isStringTooLong = (msg: string, capacity = 4999) => {
  return msg.length > capacity;
}
