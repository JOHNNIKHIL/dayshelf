CREATE TYPE "Mood" AS ENUM ('VERY_LOW', 'LOW', 'OKAY', 'GOOD', 'GREAT');

CREATE TABLE "day" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "title" TEXT,
    "thoughts" TEXT,
    "gratitude" TEXT,
    "highlights" TEXT,
    "challenges" TEXT,
    "wins" TEXT,
    "mood" "Mood",
    "energy" INTEGER,
    "stress" INTEGER,
    "productivity" INTEGER,
    "social" INTEGER,
    "sleep" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "day_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "day_event" (
    "id" TEXT NOT NULL,
    "time" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dayId" TEXT NOT NULL,
    CONSTRAINT "day_event_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "day_plan" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dayId" TEXT NOT NULL,
    CONSTRAINT "day_plan_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "day_userId_date_key" ON "day"("userId", "date");
CREATE INDEX "day_userId_date_idx" ON "day"("userId", "date");
CREATE INDEX "day_event_dayId_sortOrder_idx" ON "day_event"("dayId", "sortOrder");
CREATE INDEX "day_plan_dayId_completed_priority_idx" ON "day_plan"("dayId", "completed", "priority");

ALTER TABLE "day" ADD CONSTRAINT "day_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "day_event" ADD CONSTRAINT "day_event_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "day_plan" ADD CONSTRAINT "day_plan_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
