-- Ajout d'index pour optimiser les performances des requêtes

-- Index sur les colonnes utilisées dans les filtres
CREATE INDEX IF NOT EXISTS "idx_repetiteur_ville" ON "Repetiteur"("ville");
CREATE INDEX IF NOT EXISTS "idx_repetiteur_departement" ON "Repetiteur"("departement");
CREATE INDEX IF NOT EXISTS "idx_repetiteur_statut" ON "Repetiteur"("statut");

-- Index pour la recherche par nom
CREATE INDEX IF NOT EXISTS "idx_repetiteur_nom" ON "Repetiteur"("nom");
CREATE INDEX IF NOT EXISTS "idx_repetiteur_prenom" ON "Repetiteur"("prenom");

-- Index composé pour les requêtes complexes (statut + localisation)
CREATE INDEX IF NOT EXISTS "idx_repetiteur_search" ON "Repetiteur"("statut", "departement", "ville");

-- Index pour le tri par date de création
CREATE INDEX IF NOT EXISTS "idx_repetiteur_createdat" ON "Repetiteur"("createdAt" DESC);

