import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/permissions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params;
    
    // Vérifier que l'utilisateur est authentifié
    await requireAuth();
    
    // Extraire le ID du répétiteur du publicId pour vérifier l'accès
    // Format attendu: documents/repetiteur_{timestamp}_{type}
    const regex = /documents\/repetiteur_(\d+)_(.+)/;
    const match = publicId.match(regex);
    
    if (!match) {
      return new Response('Document non trouvé', { status: 404 });
    }
    
    const repetiteurId = parseInt(match[1]);
    
    // Vérifier que le répétiteur existe et que l'utilisateur a le droit d'y accéder
    const repetiteur = await prisma.repetiteur.findUnique({
      where: { id: repetiteurId },
      select: {
        id: true,
        casierJudiciaire: true,
        carteIdentite: true,
        passeport: true,
      }
    });
    
    if (!repetiteur) {
      return new Response('Répétiteur non trouvé', { status: 404 });
    }
    
    // Trouver l'URL du document correspondant
    let documentUrl = null;
    if (repetiteur.casierJudiciaire?.includes(publicId)) {
      documentUrl = repetiteur.casierJudiciaire;
    } else if (repetiteur.carteIdentite?.includes(publicId)) {
      documentUrl = repetiteur.carteIdentite;
    } else if (repetiteur.passeport?.includes(publicId)) {
      documentUrl = repetiteur.passeport;
    }
    
    if (!documentUrl) {
      return new Response('Document non autorisé', { status: 403 });
    }
    
    // Rediriger vers l'URL Cloudinary originale
    // Cette approche masque le fait que l'accès est vérifié via l'API
    return Response.redirect(documentUrl);
    
  } catch (error) {
    console.error('Erreur lors de l\'accès au document:', error);
    
    // Si l'erreur est liée à une authentification insuffisante
    if (error instanceof Error && error.message?.includes('Non autorisé')) {
      return new Response('Accès non autorisé', { status: 403 });
    }
    
    return new Response('Erreur interne du serveur', { status: 500 });
  }
}