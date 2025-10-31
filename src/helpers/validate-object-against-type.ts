import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateObjectAgainstType<T extends object>(
  source: any,
  type: new () => T,
): Promise<void> {
  // Transform plain object to class instance
  const instance = plainToClass(type, source);

  // Validate the instance
  const errors = await validate(instance);

  if (errors.length > 0) {
    const errorMessages = errors
      .map((err) => Object.values(err.constraints || {}).join(', '))
      .join('; ');
    throw new Error(`Validation failed: ${errorMessages}`);
  }
}
