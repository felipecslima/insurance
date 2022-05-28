import { Unsubscribable } from 'rxjs';
import 'reflect-metadata';
import { DecoratorService } from './decorator.service';
/**
 * ASYNC VAR - Get all values from state.
 * Is VERY important unsubscribe this shit.
 * @returns the Decorator returns an object with {
 *   values: any,
 *   subscription: Unsubscribable
 * }
 */
export function GetFormValues(): PropertyDecorator {
  return (target: any, propertyName: string) => {
    const formService = DecoratorService.getFormService();
    const formServiceSub = formService.getValues().subscribe(values => {
      const getter = () => {
        return {
          values,
          subscription: formServiceSub
        };
      };

      const setter = () => {
        return {
          values,
          subscription: formServiceSub
        };
      };

      Object.defineProperty(target, propertyName, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
      });
    });
  };
}

export interface DecoratorFormValues {
  values: any;
  subscription: Unsubscribable;
}
