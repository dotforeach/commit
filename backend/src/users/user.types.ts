/** El usuario autenticado tal como lo ve el resto de la app (sin hash de contraseña). */
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

declare module '@nestjs/authentication' {
  interface AuthenticationTypes {
    user: AuthUser;
  }
}
