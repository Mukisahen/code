const UGANDA_PHONE_REGEX = /^\+256\d{9}$/

export function validatePhone(phone: string): string | null {
  const trimmed = phone.trim()
  if (!trimmed) return 'Phone number is required.'
  if (!UGANDA_PHONE_REGEX.test(trimmed)) {
    return 'Enter a valid Ugandan phone number, e.g. +256701234567.'
  }
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (!/\d/.test(password)) return 'Password must include at least one number.'
  return null
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) return 'Please confirm your password.'
  if (password !== confirmPassword) return 'Passwords do not match.'
  return null
}

export function validateFullName(fullName: string): string | null {
  const trimmed = fullName.trim()
  if (!trimmed) return 'Full name is required.'
  if (trimmed.length < 2) return 'Enter your full name.'
  return null
}

export function validateDistrict(district: string): string | null {
  return district.trim() ? null : 'Please select your district.'
}
