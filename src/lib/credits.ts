export function canUseCredits(user: any) {
  // admin = ilimitado
  if (user.role === "admin") {
    return true;
  }

  // usuário normal
  return user.credits > 0;
}

export function shouldConsumeCredits(user: any) {
  return user.role !== "admin";
}