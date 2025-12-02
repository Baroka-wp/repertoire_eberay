# 🚀 Guide de Premier Démarrage - E-BEYRAY

## Étapes de Configuration

### 1️⃣ Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```bash
# Base de données PostgreSQL
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth (générer avec: openssl rand -base64 32)
NEXTAUTH_SECRET="votre_secret_ultra_securise_ici"
NEXTAUTH_URL="http://localhost:3000"
```

### 2️⃣ Installation des Dépendances

```bash
npm install
```

### 3️⃣ Configuration de la Base de Données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer le schéma à la base de données
npx prisma db push
```

### 4️⃣ Créer le Premier Administrateur

**Option 1: Via l'Interface Web (Recommandé)**

1. Démarrez le serveur : `npm run dev`
2. Accédez à : `http://localhost:3000/setup-admin`
3. Cliquez sur "Créer l'administrateur"
4. Utilisez les identifiants affichés pour vous connecter

**Option 2: Via SQL Direct**

```bash
# 1. Générer le hash du mot de passe
node scripts/hash-password.mjs "VotreMotDePasse"

# 2. Copier le hash et exécuter dans votre BDD PostgreSQL:
```

```sql
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  'admin_' || gen_random_uuid()::text,
  'Administrateur',
  'admin@eberay.ne',
  'LE_HASH_GENERE_ICI',
  'admin',
  NOW(),
  NOW()
);
```

### 5️⃣ Première Connexion

1. Accédez à : `http://localhost:3000/login`
2. Connectez-vous avec :
   - **Email** : `admin@eberay.ne`
   - **Mot de passe** : `Admin123!` (ou celui que vous avez défini)

### 6️⃣ Configuration Optionnelle

**Ajouter des index pour les performances :**

```bash
# Exécuter dans PostgreSQL
psql $DATABASE_URL -f prisma/migrations/add_performance_indexes/migration.sql
```

---

## 🎯 Fonctionnalités Disponibles

### Pour l'Administrateur (`admin`)

✅ Accès complet au répertoire  
✅ Ajouter des répétiteurs  
✅ Modifier des répétiteurs  
✅ Gérer les utilisateurs (`/admin/utilisateurs`)  
✅ Créer des comptes avec différents rôles

### Pour les Éditeurs (`editor`)

✅ Accès au répertoire  
✅ Ajouter des répétiteurs  
✅ Modifier des répétiteurs  
❌ Gérer les utilisateurs

### Pour les Créateurs (`creator`)

✅ Accès au répertoire  
✅ Ajouter des répétiteurs  
❌ Modifier des répétiteurs  
❌ Gérer les utilisateurs

### Pour les Lecteurs (`viewer`)

✅ Accès au répertoire (lecture seule)  
❌ Ajouter des répétiteurs  
❌ Modifier des répétiteurs  
❌ Gérer les utilisateurs

---

## 🌐 Routes Publiques

### `/inscription`
Formulaire d'auto-inscription pour les répétiteurs

- Accessible sans connexion
- Les répétiteurs peuvent s'inscrire eux-mêmes
- Créé avec `statut: Actif` et sans `createdById`
- Page de confirmation après inscription

**Partager ce lien avec les répétiteurs !**

---

## 🔒 Sécurité

✅ Toutes les routes sont protégées par défaut  
✅ Seules `/login`, `/inscription` et `/setup-admin` sont publiques  
✅ Vérification des permissions dans chaque Server Action  
✅ Mots de passe hashés avec bcrypt (10 rounds)  
✅ Sessions JWT sécurisées (durée: 30 jours)  
✅ Headers de sécurité configurés dans `next.config.js`

---

## 📊 Traçabilité

Chaque répétiteur créé ou modifié est tracé :

- `createdById` : ID de l'utilisateur qui a créé
- `updatedById` : ID de l'utilisateur qui a modifié
- `createdAt` : Date de création
- `updatedAt` : Date de dernière modification

---

## 🐛 Dépannage

### "NEXTAUTH_SECRET is not set"
Ajoutez `NEXTAUTH_SECRET` dans votre `.env`

### "Cannot connect to database"
Vérifiez votre `DATABASE_URL` dans `.env`

### "User table does not exist"
Exécutez `npx prisma db push`

### "Admin already exists" lors du setup
Un admin existe déjà, connectez-vous directement sur `/login`

---

## 📚 Documentation

- [AUTH_SETUP.md](./AUTH_SETUP.md) - Guide complet de l'authentification
- [README.md](./README.md) - Documentation générale du projet
- [NextAuth.js](https://next-auth.js.org/) - Documentation officielle

---

**Bon démarrage avec E-BEYRAY ! 🎉**

