import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export const IsLessThanOrEqualTo = (property: string, validationOptions?: ValidationOptions) => {
  return (object: Record<any, any>, propertyName: string) => {
    registerDecorator({
      name: 'isLessThanOrEqualTo',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return typeof value === typeof relatedValue && value <= relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          return `$property must be less than or equal to ${args.constraints[0]}`;
        },
      },
    });
  };
};
