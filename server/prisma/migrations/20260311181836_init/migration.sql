-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'GITHUB');

-- CreateEnum
CREATE TYPE "Platfrom" AS ENUM ('wellfound', 'naukri', 'linkedin', 'yc', 'instaHyre');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('remote', 'hybrid', 'onsite');

-- CreateEnum
CREATE TYPE "ScraperStatus" AS ENUM ('running', 'completed', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPostings" (
    "id" TEXT NOT NULL,
    "platfrom" "Platfrom" NOT NULL,
    "role" TEXT NOT NULL,
    "experienceRequired" INTEGER NOT NULL,
    "location" TEXT[],
    "jobType" "JobType" NOT NULL,
    "publishedDate" TIMESTAMP(3) NOT NULL,
    "jobUrl" TEXT NOT NULL,

    CONSTRAINT "JobPostings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RawJobData" (
    "id" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "rawData" JSONB NOT NULL,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RawJobData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookmarkFolder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "sharableLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookmarkFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookmarkItems" (
    "id" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookmarkItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applied" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Applied_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScraperRuns" (
    "id" TEXT NOT NULL,
    "platfrom" "Platfrom" NOT NULL,
    "status" "ScraperStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "jobsfound" INTEGER NOT NULL,
    "jobsInserted" INTEGER NOT NULL,
    "errorMessage" TEXT,

    CONSTRAINT "ScraperRuns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_provider_providerUserId_key" ON "User"("provider", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "JobPostings_jobUrl_key" ON "JobPostings"("jobUrl");

-- CreateIndex
CREATE UNIQUE INDEX "RawJobData_jobPostingId_key" ON "RawJobData"("jobPostingId");

-- CreateIndex
CREATE UNIQUE INDEX "BookmarkFolder_userId_name_key" ON "BookmarkFolder"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "BookmarkItems_folderId_jobPostingId_key" ON "BookmarkItems"("folderId", "jobPostingId");

-- CreateIndex
CREATE UNIQUE INDEX "Applied_jobPostingId_userId_key" ON "Applied"("jobPostingId", "userId");

-- AddForeignKey
ALTER TABLE "RawJobData" ADD CONSTRAINT "RawJobData_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPostings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkFolder" ADD CONSTRAINT "BookmarkFolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkItems" ADD CONSTRAINT "BookmarkItems_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "BookmarkFolder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkItems" ADD CONSTRAINT "BookmarkItems_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPostings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applied" ADD CONSTRAINT "Applied_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applied" ADD CONSTRAINT "Applied_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPostings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
