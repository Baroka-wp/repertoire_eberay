# 🔐 Configuration de l'Authentification

## 📋 Système d'authentification implémenté

✅ **NextAuth.js v5** avec gestion des rôles  
✅ **Middleware** pour protéger toutes les routes  
✅ **Page de login** sécurisée  
✅ **Formulaire d'inscription public** pour les répétiteurs  
✅ **Traçabilité** des créations/modifications

---

## 🚀 Première Installation

### 1. Ajouter la variable d'environnement

Ajoutez dans votre fichier `.env` :

```bash
# NextAuth Secret (générer avec: openssl rand -base64 32)
NEXTAUTH_SECRET="votre_secret_ici_très_long_et_aléatoire"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Créer le premier administrateur

**Option A: Via SQL direct (Recommandé)**

```sql
-- Hash du mot de passe 'Admin123!' avec bcrypt
-- Vous devez générer votre propre hash via: https://bcrypt-generator.com/
-- Ou via Node.js: bcrypt.hash('Admin123!', 10)

INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  'admin_' || gen_random_uuid()::text,
  'Administrateur',
  'admin@eberay.ne',
  '$2a$10$YourHashedPasswordHere',  -- Remplacer par votre hash
  'admin',
  NOW(),
  NOW()
);
```

**Option B: Via script Node.js (à finaliser)**

Les scripts dans `/scripts` nécessitent d'être finalisés. Pour l'instant, utilisez l'option A.

---

## 👥 Système de Rôles

| Rôle | Droits | Description |
|------|--------|-------------|
| **admin** | Tout | Gestion complète : utilisateurs, répétiteurs, configuration |
| **editor** | Ajouter + Modifier | Peut créer et modifier les répétiteurs |
| **creator** | Ajouter uniquement | Peut uniquement créer de nouveaux répétiteurs |
| **viewer** | Lecture seule | Peut uniquement consulter le répertoire |

---

## 🔗 Routes et Accès

### Routes Protégées (Connexion requise)
- `/` - Page d'accueil
- `/repertoire` - Liste des répétiteurs
- `/ajouter` - Ajouter un répétiteur (role: creator, editor, admin)
- `/modifier/[id]` - Modifier (role: editor, admin)
- `/repetiteur/[id]` - Voir fiche

### Routes Publiques (Sans connexion)
- `/login` - Connexion
- `/inscription` - Formulaire d'auto-inscription pour répétiteurs

---

## 🔒 Première Connexion

1. Accédez à `http://localhost:3000/login`
2. Utilisez les identifiants créés :
   - **Email**: `admin@eberay.ne`
   - **Mot de passe**: `Admin123!`
3. ⚠️ **Changez immédiatement le mot de passe après la première connexion**

---

## 📝 Ajouter d'autres utilisateurs

Une fois connecté en tant qu'admin, vous pourrez :
1. Accéder à `/admin/utilisateurs` (à implémenter)
2. Créer de nouveaux utilisateurs avec différents rôles
3. Gérer les permissions

---

## 🔧 Sécurité

✅ Mots de passe hashés avec bcrypt (rounds: 10)  
✅ Sessions JWT sécurisées (30 jours)  
✅ Protection CSRF native Next.js  
✅ Middleware protège toutes les routes  
✅ Seul `/inscription` est public pour les répétiteurs

---

## 📚 Prochaines Étapes

1. ✅ Configuration NextAuth - **Fait**
2. ✅ Page de login - **Fait**  
3. ✅ Middleware de protection - **Fait**
4. ✅ Schéma BDD avec User - **Fait**
5. ⏳ Page de gestion des utilisateurs - **À faire**
6. ⏳ Vérification des droits dans les actions - **À faire**
7. ⏳ Adaptation du formulaire d'inscription public - **À faire**

---

## 🐛 Dépannage

### Erreur "NEXTAUTH_SECRET missing"
Ajoutez la variable dans votre `.env`

### Erreur "User table not found"
Exécutez `npx prisma db push`

### Impossible de se connecter
Vérifiez que l'utilisateur existe dans la base avec le bon hash de mot de passe

---

**Documentation NextAuth**: https://next-auth.js.org/

