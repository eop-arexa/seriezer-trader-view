export class RequiredConfigurationNotFoundError extends Error {
  constructor(fields: string[]) {
    super(`All field must be provided ${fields}`);
  }
}
