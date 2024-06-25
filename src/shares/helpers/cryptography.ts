import bcrypt from 'bcrypt';
export async function hashString(data: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(data, salt);
}

export async function isHashEqual(data: string, hash: string): Promise<boolean> {
  return bcrypt.compare(data, hash);
}
