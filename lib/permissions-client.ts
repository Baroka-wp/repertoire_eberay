// Helper pour vérifier les permissions côté client
export function hasPermission(role: string | undefined | null, action: 'create' | 'modify' | 'delete' | 'admin'): boolean {
  if (!role) return false

  const permissionMap: Record<string, string[]> = {
    create: ['admin', 'editor', 'creator'],
    modify: ['admin', 'editor'],
    delete: ['admin'],
    admin: ['admin']
  }

  return permissionMap[action]?.includes(role) || false
}

