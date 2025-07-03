import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsLocalPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLocalPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Phone number must be a local number with 7–12 digits only',
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /^\d{7,12}$/.test(value);
        },
      },
    });
  };
}
