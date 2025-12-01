# E-BEYRAY - Répertoire des Répétiteurs

![Logo E-BEYRAY](public/logp_eberay.png)

Plateforme de gestion des répétiteurs de l'Organisation Eberay au Niger.

## 🎯 À propos

E-BEYRAY est une application web moderne pour gérer le répertoire des répétiteurs inscrits à l'organisation Eberay. La plateforme permet de :

- 📋 Consulter le répertoire complet des répétiteurs
- ➕ Inscrire de nouveaux répétiteurs
- ✏️ Modifier les informations existantes
- 🔍 Rechercher et filtrer par région, ville, matière et niveau

## 🚀 Technologies

- **Framework**: [Next.js 16](https://nextjs.org/) avec App Router
- **Base de données**: PostgreSQL avec [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI/UX**: Design institutionnel professionnel
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) pour les toasts
- **Icônes**: [Lucide React](https://lucide.dev/)

## 📦 Installation

```bash
# Cloner le repository
git clone git@github.com:Baroka-wp/repertoire_eberay.git
cd repertoire_eberay

# Installer les dépendances
npm install

# Configurer la base de données
# Créer un fichier .env avec :
# DATABASE_URL="postgresql://user:password@localhost:5432/eberay"

# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma db push

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🗄️ Structure de la base de données

```prisma
model Repetiteur {
  id            Int      @id @default(autoincrement())
  nom           String
  prenom        String
  email         String?
  telephone     String
  ville         String
  departement   String
  matieres      String   // Format: "Math, PC - [Lycée : 2nde, 1ère]"
  diplome       String
  anneeEntree   Int
  statut        String   @default("Actif")
  createdAt     DateTime @default(now())
}
```

## 📱 Fonctionnalités principales

### Page d'accueil (Onboarding)
- Design épuré avec logo Eberay
- Deux actions principales : Consulter / Ajouter

### Répertoire
- Filtrage côté serveur avec Prisma (optimisé pour les performances)
- Recherche par nom/prénom
- Filtres avancés : région, ville, matière, niveau
- Synchronisation dynamique région-ville
- Tableau interactif avec liens vers les fiches détaillées

### Inscription de répétiteur
- Formulaire multi-étapes (3 étapes)
- Sélection multiple de matières et classes
- Validation à chaque étape
- UI moderne avec design institutionnel

### Fiche répétiteur
- Affichage détaillé des informations
- Design professionnel type "fiche bancaire"
- Bouton de modification rapide

### Modification
- Formulaire pré-rempli avec les données existantes
- Possibilité de changer le statut (Actif/Suspendu)
- Toast de confirmation après modification

## 🎨 Design

L'application utilise une palette de couleurs professionnelle et institutionnelle :
- Couleurs principales : Slate (800, 900) et Neutral (50-200)
- Évite les couleurs vives pour un aspect sérieux
- Design inspiré des "fiches bancaires" pour les profils

## 🌍 Régions et villes

Le système gère 8 régions du Niger :
- Niamey
- Dosso
- Maradi
- Tahoua
- Zinder
- Agadez
- Diffa
- Tillabéri

Chaque région a une liste de villes associées pour un filtrage précis.

## 📚 Niveaux d'enseignement

- **Primaire** : CI, CP, CE1, CE2, CM1, CM2
- **Collège** (secondaire_inf) : 6ème, 5ème, 4ème, 3ème
- **Lycée** (secondaire_sup) : 2nde, 1ère, Terminale

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint

# Générer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio
npx prisma studio
```

## 📄 Licence

Propriété de l'Organisation Eberay - Tous droits réservés

## 👥 Contact

Pour toute question concernant l'application, contactez l'Organisation Eberay.
