/**
 * Contratos de Autenticação e Conta do MU Kame API 2.1.1.
 */

export interface AuthAccount {
  AccountId: string;
  DisplayName: string;
  Email: string;
  AccountLevel: number;
  AccountExpireDate: string | null;
  BlockCode: string;
  RegisteredAt?: string;
  IsOnline?: boolean;
  ServerName?: string | null;
  ConnectTM?: string | null;
  DisConnectTM?: string | null;
  OnlineHours?: number | null;
}

export interface AuthSession {
  SessionId: string;
  AccountId: string;
  CreatedAt: string;
  LastSeenAt: string;
  ExpiresAt: string;
  DisplayName: string;
  Email: string;
  AccountLevel: number;
  AccountExpireDate: string | null;
  BlockCode: string;
  IsOnline: boolean;
}

export interface AuthMeResponse {
  ok: boolean;
  data: {
    session: AuthSession;
  };
}

export interface LoginResponse {
  ok: boolean;
  data: {
    account: AuthAccount;
    expiresAt: string;
  };
}

export interface RegisterResponse {
  ok: boolean;
  data: {
    account: Partial<AuthAccount>;
    message: string;
  };
}

export interface ForgotPasswordResponse {
  ok: boolean;
  data: {
    message: string;
  };
}

export interface ResetPasswordResponse {
  ok: boolean;
  data: {
    message: string;
  };
}

export interface CharacterItem {
  Name: string;
  Class: number;
  Level: number;
  LevelUpPoint: number;
  Strength: number;
  Dexterity: number;
  Vitality: number;
  Energy: number;
  Leadership: number;
  Zen: number;
  MapNumber: number;
  MapPosX: number;
  MapPosY: number;
  PkLevel: number;
  ResetCount: number;
  MasterResetCount: number;
  Resets: number;
  MResets: number;
  Kills: number;
  Deads: number;
  LastLoginAt: string | null;
  BlockExpiresAt: string | null;
}

export interface CharactersResponse {
  ok: boolean;
  data: {
    items: CharacterItem[];
  };
  meta: {
    total: number;
  };
}

export interface AuthErrorPayload {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}

/**
 * Mapeamento de códigos de erro da API 2.1.1
 */
export const AUTH_ERROR_CODES = {
  INVALID_ACCOUNT_ID: "INVALID_ACCOUNT_ID",
  INVALID_GAME_PASSWORD: "INVALID_GAME_PASSWORD",
  INVALID_DISPLAY_NAME: "INVALID_DISPLAY_NAME",
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_PORTAL_PASSWORD: "INVALID_PORTAL_PASSWORD",
  REGISTRATION_FAILED: "REGISTRATION_FAILED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  ORIGIN_NOT_ALLOWED: "ORIGIN_NOT_ALLOWED",
  METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
  AUTH_DATABASE_UNAVAILABLE: "AUTH_DATABASE_UNAVAILABLE",
  AUTHENTICATION_UNAVAILABLE: "AUTHENTICATION_UNAVAILABLE",
  SESSION_CREATION_FAILED: "SESSION_CREATION_FAILED",
  CHARACTERS_QUERY_FAILED: "CHARACTERS_QUERY_FAILED",
  INVALID_RESET_TOKEN: "INVALID_RESET_TOKEN",
  RESET_PASSWORD_FAILED: "RESET_PASSWORD_FAILED",
  PASSWORD_HASH_FAILED: "PASSWORD_HASH_FAILED",
  INVALID_API_RESPONSE: "INVALID_API_RESPONSE",
} as const;
