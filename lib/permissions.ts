import { auth } from './auth'

export type UserRole = 'admin' | 'editor' | 'creator' | 'viewer'

export interface Permission {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canManageUsers: boolean
}

export function getPermissions(role: UserRole): Permission {
  switch (role) {
    case 'admin':
      return {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canManageUsers: true,
      }
    case 'editor':
      return {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canManageUsers: false,
      }
    case 'creator':
      return {
        canCreate: true,
        canEdit: false,
        canDelete: false,
        canManageUsers: false,
      }
    case 'viewer':
    default:
      return {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canManageUsers: false,
      }
  }
}

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Non autorisé')
  }
  return user
}

export async function requirePermission(permission: keyof Permission) {
  const user = await requireAuth()
  const permissions = getPermissions(user.role as UserRole)
  
  if (!permissions[permission]) {
    throw new Error('Permission refusée')
  }
  
  return user
}

