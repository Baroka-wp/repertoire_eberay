# 🎓 E-Beyray - Répertoire des Répétiteurs

Plateforme de gestion des répétiteurs de l'Organisation E-Beyray au Niger.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- PostgreSQL (ou Neon DB)
- npm ou yarn

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/Baroka-wp/repertoire_eberay.git
cd repertoire_eberay

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
# Créer un fichier .env à la racine
DATABASE_URL="votre_connexion_postgresql"
NEXTAUTH_SECRET="votre_secret_genere"
NEXTAUTH_URL="http://localhost:3000"

# 4. Synchroniser la base de données
npx prisma db push
npx prisma generate

# 5. Lancer le serveur de développement
npm run dev
```

Accédez à : **http://localhost:3000**

## 🔐 Premier démarrage

1. Visitez `/setup-admin` pour créer le premier administrateur
2. Connectez-vous sur `/login`
3. Commencez à ajouter des répétiteurs !

## 📚 Documentation

- **[WORKFLOW.md](./WORKFLOW.md)** - Workflow Git et conventions de commits
- **[Prisma Schema](./prisma/schema.prisma)** - Structure de la base de données

## 🛠️ Technologies

- **Framework** : Next.js 16 (App Router)
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : NextAuth.js v5
- **UI** : Tailwind CSS
- **Carte** : Leaflet + React-Leaflet
- **TypeScript** : Type-safety

## 📋 Fonctionnalités

### ✅ Gestion des Répétiteurs
- Ajout multi-étapes avec validation
- Modification et consultation des profils
- Filtrage avancé (région, ville, matière, niveau)
- Vue liste et carte interactive

### 👥 Gestion des Utilisateurs
- 4 rôles : Admin, Editor, Creator, Viewer
- Système de permissions granulaire
- Traçabilité des actions

### 🎨 Interface
- Design institutionnel professionnel
- Menu hamburger avec sidebar
- Responsive (mobile/desktop)
- Toast notifications

## 🌿 Branches

- **`main`** : Production (stable)
- **`dev`** : Développement (nouvelles fonctionnalités)

Voir [WORKFLOW.md](./WORKFLOW.md) pour plus de détails.

## 🚀 Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build production
npm start            # Démarrer en production
npm run lint         # Linter ESLint
```

## 📝 Structure du projet

```
eberay-app/
├── app/
│   ├── (pages)           # Pages Next.js
│   ├── api/              # API routes
│   ├── components/       # Composants React
│   └── actions.ts        # Server actions
├── lib/
│   ├── auth.ts           # Configuration NextAuth
│   ├── prisma.ts         # Client Prisma
│   └── permissions.ts    # Système de permissions
├── prisma/
│   └── schema.prisma     # Schéma de la base
└── public/               # Assets statiques
```

## 🐛 Dépannage

### "NEXTAUTH_SECRET missing"
Ajoutez la variable dans votre `.env` :
```bash
openssl rand -base64 32
```

### "Cannot connect to database"
Vérifiez votre `DATABASE_URL` dans le `.env`

### Problèmes de build
```bash
rm -rf .next
npm run build
```

## 📄 Licence

Propriété de l'Organisation E-Beyray - Niger

## 👥 Équipe

Développé pour l'Organisation E-Beyray

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024
