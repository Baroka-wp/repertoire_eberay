import { requirePermission } from '@/lib/permissions'
import AjouterForm from './AjouterForm'

export default async function AjouterPage() {
  // Vérifier que l'utilisateur a la permission de créer
  await requirePermission('canCreate')
  
  return <AjouterForm />
}

