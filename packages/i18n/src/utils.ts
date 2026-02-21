import { m } from "./paraglide/messages";
import type { LocalizedString } from "./paraglide/runtime";

type MessageKey = keyof typeof m;
type MessageParams = Record<string, string | number>;

export const t = (key: MessageKey, params?: MessageParams): LocalizedString => {
  const fn = m[key as keyof typeof m] as (
    params?: MessageParams,
  ) => LocalizedString;
  return fn(params);
};
