import { isA } from './IsA';
import { Text } from './Text';

export type Result = { message: Text; domain?: string; location?: string };

export const result = (message: Text, domain = 'easy', location?: string): Result => ({ message, domain, location });

export const isResult = (r?: unknown): r is Result => isA<Result>(r, 'message');
