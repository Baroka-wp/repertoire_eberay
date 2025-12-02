# 🔄 Workflow Git - E-Beyray

## 📋 Structure des branches

### `main` - Branche de Production
- Code stable et testé
- Déployé en production
- **Ne jamais pousser directement sur main**
- Merge uniquement depuis `dev` après validation

### `dev` - Branche de Développement
- Toutes les nouvelles fonctionnalités
- Tests et corrections de bugs
- Branche par défaut pour le développement

---

## 🚀 Workflow recommandé

### 1. Travailler sur une nouvelle fonctionnalité

```bash
# S'assurer d'être sur dev et à jour
git checkout dev
git pull origin dev

# Créer une branche feature (optionnel)
git checkout -b feature/nom-fonctionnalite

# Développer...
git add .
git commit -m "Description de la fonctionnalité"

# Pousser sur dev (ou votre branche feature)
git push origin dev
```

### 2. Tester sur dev

```bash
# S'assurer que tout fonctionne
npm run build
npm run dev
```

### 3. Merger dev vers main (Production)

```bash
# Une fois les tests validés sur dev
git checkout main
git pull origin main
git merge dev
git push origin main
```

---

## 📝 Convention de commits

### Format recommandé :
```
TYPE: Description courte

[Description détaillée optionnelle]
```

### Types de commits :
- **FEAT**: Nouvelle fonctionnalité
- **FIX**: Correction de bug
- **UX**: Amélioration UX/UI
- **REFACTOR**: Refactorisation du code
- **DOCS**: Documentation
- **STYLE**: Formatage, style (pas de changement fonctionnel)
- **PERF**: Amélioration des performances
- **TEST**: Ajout/modification de tests
- **CHORE**: Tâches diverses (dépendances, config, etc.)

### Exemples :
```bash
git commit -m "FEAT: Ajout du menu hamburger avec sidebar"
git commit -m "FIX: Correction connexion admin"
git commit -m "UX: Suppression overlay noir sidebar"
git commit -m "REFACTOR: Séparation permissions client/server"
```

---

## 🔧 Commandes utiles

```bash
# Voir la branche actuelle
git branch

# Changer de branche
git checkout main
git checkout dev

# Voir les différences
git diff

# Annuler les modifications locales
git restore <fichier>

# Annuler le dernier commit (garde les changements)
git reset --soft HEAD~1

# Voir l'historique
git log --oneline --graph --all
```

---

## ⚠️ Règles importantes

1. ✅ **Toujours travailler sur `dev`**
2. ✅ **Tester avant de merger vers `main`**
3. ✅ **Faire des commits atomiques** (une fonctionnalité = un commit)
4. ✅ **Messages de commit clairs et descriptifs**
5. ❌ **Ne jamais faire de `git push --force` sur main**
6. ❌ **Ne jamais commiter de fichiers sensibles** (.env, mots de passe, etc.)

---

## 🌐 Déploiement

### Development (dev)
- Test des nouvelles fonctionnalités
- Environnement de développement

### Production (main)
- Code validé et testé
- Déployé sur le serveur de production
- Utilisé par les utilisateurs finaux

---

**Dernière mise à jour** : Décembre 2024

