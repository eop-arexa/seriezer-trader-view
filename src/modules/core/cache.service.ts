import { Injectable } from '@nestjs/common';
import {
  ACTIVATE_TOKEN,
  ADMIN_LOGIN,
  MERCHANT_RESET_PASSWORD_TOKEN,
  ADMIN_RESET_PASSWORD_TOKEN,
  RESET_PASSWORD_TOKEN,
  SYSTEM_META,
  USER_LIKE_MERCHANT_CACHE_PREFIX,
  USER_LIKE_STORE_CACHE_PREFIX,
  VERIFY_PHONE,
  VERIFY_TOKEN,
  MERCHANT_ONBOARD,
} from '../../shares/constants/redis-prefix.constant';

@Injectable()
export class CacheService {
  getVerifyTokenKey(id: number): string {
    return `${VERIFY_TOKEN}:${id}`;
  }

  getActivateTokenKey(identifier: string): string {
    return `${ACTIVATE_TOKEN}:${identifier.toLowerCase()}`;
  }

  getResetPasswordTokenKey(identifier: string): string {
    return `${RESET_PASSWORD_TOKEN}:${identifier}`;
  }

  getUserLikeMerchantKey(userId: number, merchantId: number): string {
    return `${USER_LIKE_MERCHANT_CACHE_PREFIX}:${userId}_${merchantId}`;
  }

  getUserLikeStoreKey(userId: number, storeId: number): string {
    return `${USER_LIKE_STORE_CACHE_PREFIX}:${userId}_${storeId}`;
  }

  getVerifyPhoneKey(userId: number, phone: string): string {
    return `${VERIFY_PHONE}:${userId}_${phone}`;
  }

  getMerchantOnboardKey(merchantOnboardId: number): string {
    return `${MERCHANT_ONBOARD}:${merchantOnboardId}`;
  }

  getSystemMetaKey(key: string): string {
    return `${SYSTEM_META}:${key}`;
  }
  getAdminLoginKey(userId: number) {
    return `${ADMIN_LOGIN}:${userId}`;
  }

  getMerchantResetPasswordTokenKey(identifier: string): string {
    return `${MERCHANT_RESET_PASSWORD_TOKEN}:${identifier}`;
  }

  getAdminResetPasswordTokenKey(identifier: string): string {
    return `${ADMIN_RESET_PASSWORD_TOKEN}:${identifier}`;
  }
}
