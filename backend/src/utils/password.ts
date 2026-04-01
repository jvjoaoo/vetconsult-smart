import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * Tipo padrão de retorno para validações
 */
export type PasswordValidationResult = {
  isValid: boolean;
  message: string;
};

/**
 * Gera hash da senha
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara senha informada com hash armazenado
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Valida força da senha
 */
export function validatePasswordStrength(
  password: string
): PasswordValidationResult {
  if (!password || password.trim().length === 0) {
    return {
      isValid: false,
      message: "A senha é obrigatória."
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "A senha deve ter no mínimo 8 caracteres."
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos uma letra maiúscula."
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos uma letra minúscula."
    };
  }

  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos um número."
    };
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-\\/\[\]=+;']/.test(password)) {
    return {
      isValid: false,
      message: "A senha deve conter pelo menos um caractere especial."
    };
  }

  return {
    isValid: true,
    message: "Senha válida."
  };
}