-- AlterTable
ALTER TABLE "Repetiteur" ADD COLUMN     "carteIdentite" TEXT,
ADD COLUMN     "casierJudiciaire" TEXT,
ADD COLUMN     "documentsVerifies" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passeport" TEXT;
