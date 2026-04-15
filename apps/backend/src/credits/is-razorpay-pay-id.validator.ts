import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsRazorpayPaymentId(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isRazorpayPaymentId',
      target: object.constructor,
      propertyName: propertyName,
      options: options,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && /^pay_[a-zA-Z0-9]{14,20}$/.test(value);
        },
        defaultMessage() {
          return 'Invalid Razorpay payment ID format';
        },
      },
    });
  };
}
