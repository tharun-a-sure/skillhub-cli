import Conf from "conf";
import { z } from "zod";

const ConfigSchema = z.object({
  apiKey: z.string().startsWith("sh_").optional(),
  apiUrl: z.string().url().default("https://skillhub.dev"),
  username: z.string().optional(),
});

type Config = z.infer<typeof ConfigSchema>;

const store = new Conf<Config>({
  projectName: "skillhub",
  schema: {
    apiKey:   { type: "string" },
    apiUrl:   { type: "string", default: "https://skillhub.dev" },
    username: { type: "string" },
  },
});

export const config = {
  get<K extends keyof Config>(key: K): Config[K] {
    return store.get(key) as Config[K];
  },
  set<K extends keyof Config>(key: K, value: Config[K]): void {
    store.set(key, value as string);
  },
  clear(): void {
    store.clear();
  },
  get apiKey(): string | undefined { return store.get("apiKey"); },
  get apiUrl(): string { return store.get("apiUrl") ?? "https://skillhub.dev"; },
  get username(): string | undefined { return store.get("username"); },
};
