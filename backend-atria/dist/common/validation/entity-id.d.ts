export declare function IsEntityId(options?: {
    optional?: boolean;
    each?: boolean;
}): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function ToUpperEnum(): PropertyDecorator;
