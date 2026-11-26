/** Contratos con el backend (hasta generar el cliente desde OpenAPI). Bytes = base64 estándar. */

export interface TokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface MeResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    locale: string;
    timezone: string;
    defaultHouseholdId: string | null;
    onboardingStep: number;
    onboardingCompletedAt: string | null;
  };
  keys: {
    keyVersion: number;
    publicKey: string;
    signingPublicKey: string;
    encryptedPrivateKeys: string;
    kdfSalt: string;
    kdfParams: { alg: 'argon2id13'; opsLimit: number; memLimit: number };
    recoveryEncryptedKeys: string;
    recoveryKdfSalt: string;
  };
  households: MeHousehold[];
}

export interface MeHousehold {
  id: string;
  baseCurrency: string;
  isPersonal: boolean;
  currentKeyVersion: number;
  usdRateType: string;
  payload: string;
  keyVersion: number;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  status: 'PENDING_KEY' | 'ACTIVE';
  memberKeys: {
    version: number;
    userKeyVersion: number;
    wrappedKey: string;
    signature: string;
    wrappedById: string;
    wrappedBySigningPublicKey: string | null;
  }[];
}

/** Contenido cifrado del payload de un hogar. */
export interface HouseholdPayload {
  name: string;
  financialLevel: string;
}

export interface RegisterRequest {
  userId: string;
  email: string;
  password: string;
  displayName: string;
  locale: string;
  timezone: string;
  keys: MeResponse['keys'] extends infer K ? Omit<K, 'keyVersion'> : never;
  household: {
    id: string;
    baseCurrency: string;
    payload: string;
    memberKey: { wrappedKey: string; signature: string };
  };
  categories: {
    id: string;
    parentId: string | null;
    kind: 'INCOME' | 'EXPENSE';
    budgetGroup: 'NEEDS' | 'WANTS' | 'SAVINGS' | null;
    systemKey: string | null;
    payload: string;
  }[];
}
