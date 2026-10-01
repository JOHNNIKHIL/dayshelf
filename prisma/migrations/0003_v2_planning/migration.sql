CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED');
CREATE TYPE "MilestoneStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED');

CREATE TABLE "goal" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
  "targetDate" DATE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "goal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "milestone" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "MilestoneStatus" NOT NULL DEFAULT 'TODO',
  "dueDate" DATE,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "goalId" TEXT NOT NULL,
  CONSTRAINT "milestone_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "monthly_plan" (
  "id" TEXT NOT NULL,
  "month" DATE NOT NULL,
  "title" TEXT,
  "focus" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "monthly_plan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "monthly_plan_item" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "priority" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "monthlyPlanId" TEXT NOT NULL,
  "goalId" TEXT,
  "milestoneId" TEXT,
  CONSTRAINT "monthly_plan_item_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "habit" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "frequency" TEXT NOT NULL DEFAULT 'daily',
  "targetPerWeek" INTEGER NOT NULL DEFAULT 7,
  "archived" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "habit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "habit_log" (
  "id" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "completed" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "habitId" TEXT NOT NULL,
  CONSTRAINT "habit_log_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "day_plan" ADD COLUMN "goalId" TEXT;
ALTER TABLE "day_plan" ADD COLUMN "milestoneId" TEXT;

CREATE UNIQUE INDEX "monthly_plan_userId_month_key" ON "monthly_plan"("userId", "month");
CREATE UNIQUE INDEX "habit_log_habitId_date_key" ON "habit_log"("habitId", "date");
CREATE INDEX "goal_userId_status_idx" ON "goal"("userId", "status");
CREATE INDEX "goal_userId_targetDate_idx" ON "goal"("userId", "targetDate");
CREATE INDEX "milestone_goalId_status_sortOrder_idx" ON "milestone"("goalId", "status", "sortOrder");
CREATE INDEX "milestone_goalId_dueDate_idx" ON "milestone"("goalId", "dueDate");
CREATE INDEX "monthly_plan_userId_month_idx" ON "monthly_plan"("userId", "month");
CREATE INDEX "monthly_plan_item_monthlyPlanId_completed_priority_idx" ON "monthly_plan_item"("monthlyPlanId", "completed", "priority");
CREATE INDEX "monthly_plan_item_goalId_idx" ON "monthly_plan_item"("goalId");
CREATE INDEX "monthly_plan_item_milestoneId_idx" ON "monthly_plan_item"("milestoneId");
CREATE INDEX "habit_userId_archived_idx" ON "habit"("userId", "archived");
CREATE INDEX "habit_log_habitId_date_idx" ON "habit_log"("habitId", "date");
CREATE INDEX "day_plan_goalId_idx" ON "day_plan"("goalId");
CREATE INDEX "day_plan_milestoneId_idx" ON "day_plan"("milestoneId");

ALTER TABLE "goal" ADD CONSTRAINT "goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "milestone" ADD CONSTRAINT "milestone_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "monthly_plan" ADD CONSTRAINT "monthly_plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "monthly_plan_item" ADD CONSTRAINT "monthly_plan_item_monthlyPlanId_fkey" FOREIGN KEY ("monthlyPlanId") REFERENCES "monthly_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "monthly_plan_item" ADD CONSTRAINT "monthly_plan_item_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "monthly_plan_item" ADD CONSTRAINT "monthly_plan_item_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "habit" ADD CONSTRAINT "habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "habit_log" ADD CONSTRAINT "habit_log_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "day_plan" ADD CONSTRAINT "day_plan_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "day_plan" ADD CONSTRAINT "day_plan_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
