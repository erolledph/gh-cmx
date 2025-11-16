export function checkAuth(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}
