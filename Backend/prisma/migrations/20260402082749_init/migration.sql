-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_clicks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "feature_name" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "feature_clicks_feature_name_idx" ON "feature_clicks"("feature_name");

-- CreateIndex
CREATE INDEX "feature_clicks_timestamp_idx" ON "feature_clicks"("timestamp");

-- CreateIndex
CREATE INDEX "feature_clicks_user_id_idx" ON "feature_clicks"("user_id");

-- AddForeignKey
ALTER TABLE "feature_clicks" ADD CONSTRAINT "feature_clicks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
