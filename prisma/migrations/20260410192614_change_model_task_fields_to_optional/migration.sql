-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_team_id_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_user_id_fkey";

-- AlterTable
ALTER TABLE "task" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "team_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
