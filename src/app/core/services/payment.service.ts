import { Injectable } from '@angular/core';

/**
 * PaymentService provides configuration for Google Pay integration.
 * It generates the payment data request object required by the Google Pay button.
 */
@Injectable({ providedIn: 'root' })
export class PaymentService {
  /**
   * Builds and returns a PaymentDataRequest object for Google Pay.
   * This object defines payment methods, merchant info, and transaction details.
   * @param price The total price for the transaction (as a string).
   * @param courseName The name of the course being purchased (not currently used in the payload).
   * @returns A PaymentDataRequest object for use with the Google Pay API.
   */
  getPaymentDataRequest(price: string, courseName: string): google.payments.api.PaymentDataRequest {
    return {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'example', // Replace with your real gateway for production
              gatewayMerchantId: 'exampleGatewayMerchantId'
            }
          }
        }
      ],
      merchantInfo: {
        merchantId: '01234567890123456789', // Replace with your merchantId
        merchantName: 'Demo Merchant'
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: price,
        currencyCode: 'USD',
        countryCode: 'US'
      }
    };
  }
}