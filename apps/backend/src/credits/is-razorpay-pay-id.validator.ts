import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsRazorpayPaymentId(options?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRazorpayPaymentId',
      target: object.constructor,
      propertyName: propertyName,
      options: options,
      validator: {
        validate(value: any, validationArguments: ValidationArguments) {
          return typeof value === 'string' && /^pay_[a-zA-Z0-9]{14,20}$/.test(value);
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Invalid Razorpay payment ID format';
        },
      },
    });
  };
}
