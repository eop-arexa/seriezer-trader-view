import { HttpStatus } from '@nestjs/common';

export interface IError {
  message: string;
  errorCode: string;
  statusCode: HttpStatus;
}
export const ErrorCodeGroup = {
  SERVER: `1001`,
  PAYMENT: `2001`,
  SHIPMENT: `3001`,
};
export const ErrorCodes = {
  SERVER: {
    INTERNAL_SERVER_ERROR: `${ErrorCodeGroup.SERVER}001`,
    CANNOT_SUBMIT_ORDER_TO_SC: `${ErrorCodeGroup.SERVER}002`,
    PRIVATE_CHAIN_ERROR: `${ErrorCodeGroup.SERVER}003`,
  },
  PAYMENT: {
    PAYMENT_UNSUCCESSFUL: `${ErrorCodeGroup.PAYMENT}001`,
    PAYMENT_PRE_AUTH_UNSUCCESSFUL: `${ErrorCodeGroup.PAYMENT}002`,
  },
  SHIPMENT: {
    LALAMOVE_PLACE_ORDER_UNSUCCESSFUL: `${ErrorCodeGroup.SHIPMENT}001`,
    LALAMOVE_REQUEST_QUOTATION_UNSUCCESSFUL: `${ErrorCodeGroup.SHIPMENT}002`,
  },
};

export const Errors = {
  SERVER: {
    INTERNAL_SERVER_ERROR: {
      message: 'Internal server error occurred',
      errorCode: ErrorCodes.SERVER.INTERNAL_SERVER_ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    CANNOT_SUBMIT_ORDER_TO_SC: {
      message: 'Internal server error occurred',
      errorCode: ErrorCodes.SERVER.CANNOT_SUBMIT_ORDER_TO_SC,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    PRIVATE_CHAIN_ERROR: {
      message: 'Internal server error occurred',
      errorCode: ErrorCodes.SERVER.PRIVATE_CHAIN_ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    },
  },
  PAYMENT: {
    PAYMENT_UNSUCCESSFUL: {
      message: 'Payment gateway provider error occurred',
      errorCode: ErrorCodes.PAYMENT.PAYMENT_UNSUCCESSFUL,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    PAYMENT_PRE_AUTH_UNSUCCESSFUL: {
      message: 'Payment gateway provider error occurred',
      errorCode: ErrorCodes.PAYMENT.PAYMENT_PRE_AUTH_UNSUCCESSFUL,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    },
  },
  SHIPMENT: {
    LALAMOVE_REQUEST_QUOTATION_UNSUCCESSFUL: {
      message: 'Delivery provider error occurred',
      errorCode: ErrorCodes.SHIPMENT.LALAMOVE_REQUEST_QUOTATION_UNSUCCESSFUL,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    LALAMOVE_PLACE_ORDER_UNSUCCESSFUL: {
      message: 'Delivery provider error occurred',
      errorCode: ErrorCodes.SHIPMENT.LALAMOVE_PLACE_ORDER_UNSUCCESSFUL,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    },
  },
};
