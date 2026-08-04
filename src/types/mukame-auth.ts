/**
 * Contratos de Autenticação e Conta do MU Kame API 2.0.
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
