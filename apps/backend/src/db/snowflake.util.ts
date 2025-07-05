import { Snowflake } from '@sapphire/snowflake';

// My Birthday :)
const epoch = new Date('2005-01-01T16:16:16+05:30');

export const snowflake = new Snowflake(epoch);

export const generateSnowflake = () => snowflake.generate().toString();

export const isValidSnowflakeUtil = (id: string): boolean => {
  try {
    // Check if it can be parsed as a snowflake
    const parsed = BigInt(id);
    // Deconstruct will throw if invalid
    snowflake.deconstruct(parsed);
    return true;
  } catch {
    return false;
  }
};
