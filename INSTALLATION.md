# 🚀 Guide d'Installation - E-Beyray

## 📋 Prérequis

- Node.js 18+ 
- PostgreSQL (ou Neon DB)
- Git

---

## 1️⃣ Installation des dépendances

```bash
npm install
```

---

## 2️⃣ Configuration de l'environnement

Créez un fichier `.env` à la racine du projet :

```bash
# Database (remplacer par votre connexion)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth - Secret pour les sessions (OBLIGATOIRE)
NEXTAUTH_SECRET="votre_secret_tres_long_et_aleatoire_ici"
NEXTAUTH_URL="http://localhost:3000"
```

### 🔑 Générer le NEXTAUTH_SECRET

**Option 1 (Linux/Mac):**
```bash
openssl rand -base64 32
```

**Option 2 (Node.js):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3 (En ligne):**
Visitez : https://generate-secret.vercel.app/32

---

## 3️⃣ Synchronisation de la base de données

```bash
npx prisma db push
npx prisma generate
```

---

## 4️⃣ Premier démarrage

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:3000**

---

## 5️⃣ Créer le premier administrateur

### ⚠️ IMPORTANT : À faire dès le premier démarrage

1. Visitez : **http://localhost:3000/setup-admin**
2. Remplissez le formulaire :
   - **Nom** : Votre nom complet
   - **Email** : Votre email (ex: admin@eberay.ne)
   - **Mot de passe** : Minimum 8 caractères
3. Cliquez sur "Créer l'administrateur"

### 🔐 Connexion

Une fois le compte créé, connectez-vous sur : **http://localhost:3000/login**

---

## 📊 Structure des Rôles

| Rôle | Permissions |
|------|-------------|
| **admin** | Tous les droits (utilisateurs, répétiteurs, configuration) |
| **editor** | Créer + Modifier les répétiteurs |
| **creator** | Créer uniquement les répétiteurs |
| **viewer** | Lecture seule |

---

## 🌐 Déploiement en production

### Variables d'environnement production

```bash
DATABASE_URL="votre_connexion_production"
NEXTAUTH_SECRET="secret_production_different_dev"
NEXTAUTH_URL="https://votre-domaine.com"
```

### Build

```bash
npm run build
npm start
```

---

## 🛠️ Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Synchroniser la base
npx prisma db push

# Régénérer Prisma Client
npx prisma generate

# Ouvrir Prisma Studio
npx prisma studio
```

---

## 🐛 Dépannage

### "NEXTAUTH_SECRET missing"
➡️ Ajoutez la variable `NEXTAUTH_SECRET` dans votre `.env`

### "Cannot connect to database"
➡️ Vérifiez votre `DATABASE_URL` dans le `.env`

### "Page /login ne charge pas"
➡️ Vérifiez que le serveur est bien démarré (`npm run dev`)

### "Impossible de se connecter"
➡️ Assurez-vous d'avoir créé un admin via `/setup-admin`

---

## 📚 Pages importantes

- **/** - Accueil avec choix répertoire/inscription
- **/login** - Connexion (protégé)
- **/setup-admin** - Créer premier admin (public, une seule fois)
- **/repertoire** - Liste des répétiteurs (protégé)
- **/ajouter** - Ajouter un répétiteur (protégé)
- **/inscription** - Formulaire public pour les répétiteurs
- **/admin/utilisateurs** - Gestion des utilisateurs (admin uniquement)

---

## 🔒 Sécurité

✅ Mots de passe hashés avec bcrypt  
✅ Sessions JWT sécurisées (30 jours)  
✅ Middleware protège toutes les routes sensibles  
✅ Seules `/login`, `/setup-admin` et `/inscription` sont publiques  
✅ Validation des permissions côté serveur

---

**Documentation NextAuth** : https://next-auth.js.org/  
**Documentation Prisma** : https://www.prisma.io/docs/

