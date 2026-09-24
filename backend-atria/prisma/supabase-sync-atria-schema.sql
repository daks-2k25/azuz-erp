-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('ADMIN', 'CONTENT_CREATOR', 'MANAGER', 'USER', 'CLIENT');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PAID', 'PENDING', 'OVERDUE');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('MEETING', 'DEADLINE', 'PUBLISH', 'OTHER');

-- CreateEnum
CREATE TYPE "KanbanTaskPriority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'PLANNED');

-- CreateEnum
CREATE TYPE "KanbanColumnType" AS ENUM ('TO_DO', 'IN_PROGRESS', 'DONE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "InternalReviewStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ContentPlatform" AS ENUM ('INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "ContentPostStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SCHEDULED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "PostFeedbackType" AS ENUM ('REJECTION_REASON', 'GENERAL_NOTE');

-- CreateEnum
CREATE TYPE "ContentPostFormat" AS ENUM ('CAROUSEL', 'REELS', 'STATIC', 'STORY');

-- CreateEnum
CREATE TYPE "ClientBriefStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'SENT', 'SIGNED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentFrequency" AS ENUM ('MONTHLY', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AssetFileType" AS ENUM ('IMAGE', 'LOGO', 'BRAND_GUIDE', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TASK_ASSIGNED', 'CONTRACT_SIGNED', 'POST_PENDING', 'POST_REJECTED');

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" "RoleName" NOT NULL,
    "description" TEXT,
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "roleId" TEXT NOT NULL,
    "clientId" TEXT,
    "userGroupId" TEXT,
    "hourlyRate" DECIMAL(10,2),
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "temporaryPassword" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#004949',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialTransaction" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "date" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT,
    "contractId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KanbanColumn" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#004949',
    "type" "KanbanColumnType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KanbanColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KanbanTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "referenceUrl" TEXT,
    "priority" "KanbanTaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "order" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3),
    "slaResponseDueAt" TIMESTAMP(3),
    "slaResolutionDueAt" TIMESTAMP(3),
    "firstResponseAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "internalReviewStatus" "InternalReviewStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
    "internalReviewNote" TEXT,
    "clientId" TEXT,
    "columnId" TEXT NOT NULL,
    "contentPostId" TEXT,
    "calendarEventId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KanbanTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KanbanTaskAsset" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER,
    "caption" TEXT,
    "uploadedById" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KanbanTaskAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KanbanTaskAssignee" (
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "KanbanTaskAssignee_pkey" PRIMARY KEY ("taskId","userId")
);

-- CreateTable
CREATE TABLE "TaskComment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskHistory" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "category" "EventCategory" NOT NULL DEFAULT 'MEETING',
    "color" TEXT,
    "referenceUrl" TEXT,
    "isPending" BOOLEAN NOT NULL DEFAULT false,
    "clientId" TEXT,
    "createdById" TEXT NOT NULL,
    "assigneeId" TEXT,
    "contentPostId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT,
    "document" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "instagram" TEXT,
    "website" TEXT,
    "street" TEXT,
    "number" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "notes" TEXT,
    "avatarUrl" TEXT,
    "clientGroupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#E8C39E',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGroupMember" (
    "userId" TEXT NOT NULL,
    "userGroupId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGroupMember_pkey" PRIMARY KEY ("userId","userGroupId")
);

-- CreateTable
CREATE TABLE "ClientGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#E8C39E',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientReport" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "generatedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientPortalToken" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientPortalToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientPortalUser" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "temporaryPassword" TEXT,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientPortalUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientPortalAuthToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "portalUserId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientPortalAuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientBrief" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'portal',
    "status" "ClientBriefStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "KanbanTaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "assignedToId" TEXT,
    "slaResponseDueAt" TIMESTAMP(3),
    "slaResolutionDueAt" TIMESTAMP(3),
    "firstResponseAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientBrief_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "platform" "ContentPlatform" NOT NULL,
    "format" "ContentPostFormat" NOT NULL DEFAULT 'STATIC',
    "scheduledDate" TIMESTAMP(3),
    "status" "ContentPostStatus" NOT NULL DEFAULT 'DRAFT',
    "internalReviewStatus" "InternalReviewStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
    "internalReviewNote" TEXT,
    "copy" TEXT NOT NULL,
    "referenceUrl" TEXT,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostVersion" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "copyText" TEXT NOT NULL,
    "mediaUrls" TEXT[],
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostFeedback" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "versionId" TEXT,
    "userId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "type" "PostFeedbackType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentAttachment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "recurringValue" DECIMAL(12,2) NOT NULL,
    "paymentFrequency" "PaymentFrequency" NOT NULL DEFAULT 'MONTHLY',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "termsContent" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "validUntil" TIMESTAMP(3),
    "totalValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "structureContent" TEXT,
    "structureImageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coverVideoUrl" TEXT,
    "coverImageUrl" TEXT,
    "schedulingUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalItem" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProposalItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalProject" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "projectUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProposalProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" "AssetFileType" NOT NULL DEFAULT 'DOCUMENT',
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL DEFAULT 0,
    "uploadedById" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#004949',
    "accentColor" TEXT NOT NULL DEFAULT '#E8C39E',
    "backgroundColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "textColor" TEXT NOT NULL DEFAULT '#0F172A',
    "sidebarColor" TEXT NOT NULL DEFAULT '#004949',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencySettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "agencyName" TEXT NOT NULL DEFAULT 'ATRIA ERP',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#004949',
    "accentColor" TEXT NOT NULL DEFAULT '#E8C39E',
    "slackWebhookUrl" TEXT,
    "discordWebhookUrl" TEXT,
    "notifyOnPostRejected" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnContractSigned" BOOLEAN NOT NULL DEFAULT true,
    "slaResponseCriticalHours" INTEGER NOT NULL DEFAULT 1,
    "slaResponseHighHours" INTEGER NOT NULL DEFAULT 4,
    "slaResponseMediumHours" INTEGER NOT NULL DEFAULT 8,
    "slaResponseLowHours" INTEGER NOT NULL DEFAULT 24,
    "slaResponsePlannedHours" INTEGER NOT NULL DEFAULT 48,
    "slaResolutionCriticalHours" INTEGER NOT NULL DEFAULT 4,
    "slaResolutionHighHours" INTEGER NOT NULL DEFAULT 24,
    "slaResolutionMediumHours" INTEGER NOT NULL DEFAULT 72,
    "slaResolutionLowHours" INTEGER NOT NULL DEFAULT 168,
    "slaResolutionPlannedHours" INTEGER NOT NULL DEFAULT 336,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgencySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "art_type_pricing" (
    "id" TEXT NOT NULL,
    "art_type" TEXT NOT NULL,
    "price_per_piece" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "art_type_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_entries" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "client_id" TEXT NOT NULL,
    "art_type" TEXT NOT NULL,
    "planned_date" TEXT NOT NULL,
    "designer_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "task_id" TEXT,
    "production_deadline" TEXT,
    "story_quantity" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agenda_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "event_date" TEXT NOT NULL,
    "start_time" TEXT,
    "end_time" TEXT,
    "event_type" TEXT NOT NULL,
    "recurrence" TEXT NOT NULL DEFAULT 'none',
    "participants" JSONB NOT NULL DEFAULT '[]',
    "meeting_link" TEXT,
    "location" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agenda_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agenda_confirmations" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "confirmed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agenda_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_requests" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "attachments" JSONB,
    "status" TEXT NOT NULL DEFAULT 'open',
    "related_task_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_reports" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approved_at" TIMESTAMP(3),
    "approved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_clientId_idx" ON "User"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_tokenHash_key" ON "AuthToken"("tokenHash");

-- CreateIndex
CREATE INDEX "AuthToken_userId_idx" ON "AuthToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialCategory_name_type_key" ON "FinancialCategory"("name", "type");

-- CreateIndex
CREATE INDEX "FinancialTransaction_userId_date_idx" ON "FinancialTransaction"("userId", "date");

-- CreateIndex
CREATE INDEX "FinancialTransaction_userId_type_idx" ON "FinancialTransaction"("userId", "type");

-- CreateIndex
CREATE INDEX "FinancialTransaction_userId_status_idx" ON "FinancialTransaction"("userId", "status");

-- CreateIndex
CREATE INDEX "FinancialTransaction_clientId_idx" ON "FinancialTransaction"("clientId");

-- CreateIndex
CREATE INDEX "FinancialTransaction_clientId_status_idx" ON "FinancialTransaction"("clientId", "status");

-- CreateIndex
CREATE INDEX "FinancialTransaction_dueDate_status_idx" ON "FinancialTransaction"("dueDate", "status");

-- CreateIndex
CREATE INDEX "FinancialTransaction_contractId_idx" ON "FinancialTransaction"("contractId");

-- CreateIndex
CREATE INDEX "KanbanColumn_order_idx" ON "KanbanColumn"("order");

-- CreateIndex
CREATE UNIQUE INDEX "KanbanTask_contentPostId_key" ON "KanbanTask"("contentPostId");

-- CreateIndex
CREATE UNIQUE INDEX "KanbanTask_calendarEventId_key" ON "KanbanTask"("calendarEventId");

-- CreateIndex
CREATE INDEX "KanbanTask_columnId_order_idx" ON "KanbanTask"("columnId", "order");

-- CreateIndex
CREATE INDEX "KanbanTask_clientId_idx" ON "KanbanTask"("clientId");

-- CreateIndex
CREATE INDEX "KanbanTaskAsset_taskId_uploadedAt_idx" ON "KanbanTaskAsset"("taskId", "uploadedAt");

-- CreateIndex
CREATE INDEX "KanbanTaskAssignee_userId_idx" ON "KanbanTaskAssignee"("userId");

-- CreateIndex
CREATE INDEX "TaskComment_taskId_createdAt_idx" ON "TaskComment"("taskId", "createdAt");

-- CreateIndex
CREATE INDEX "TaskHistory_taskId_createdAt_idx" ON "TaskHistory"("taskId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarEvent_contentPostId_key" ON "CalendarEvent"("contentPostId");

-- CreateIndex
CREATE INDEX "CalendarEvent_startAt_idx" ON "CalendarEvent"("startAt");

-- CreateIndex
CREATE INDEX "CalendarEvent_assigneeId_idx" ON "CalendarEvent"("assigneeId");

-- CreateIndex
CREATE INDEX "CalendarEvent_clientId_idx" ON "CalendarEvent"("clientId");

-- CreateIndex
CREATE INDEX "Client_companyName_idx" ON "Client"("companyName");

-- CreateIndex
CREATE INDEX "Client_clientGroupId_idx" ON "Client"("clientGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGroup_name_key" ON "UserGroup"("name");

-- CreateIndex
CREATE INDEX "UserGroupMember_userGroupId_idx" ON "UserGroupMember"("userGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientGroup_name_key" ON "ClientGroup"("name");

-- CreateIndex
CREATE INDEX "ClientReport_clientId_idx" ON "ClientReport"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientReport_clientId_month_year_key" ON "ClientReport"("clientId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPortalToken_clientId_key" ON "ClientPortalToken"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPortalToken_tokenHash_key" ON "ClientPortalToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPortalUser_clientId_key" ON "ClientPortalUser"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPortalUser_email_key" ON "ClientPortalUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPortalAuthToken_tokenHash_key" ON "ClientPortalAuthToken"("tokenHash");

-- CreateIndex
CREATE INDEX "ClientPortalAuthToken_portalUserId_idx" ON "ClientPortalAuthToken"("portalUserId");

-- CreateIndex
CREATE INDEX "ClientBrief_clientId_createdAt_idx" ON "ClientBrief"("clientId", "createdAt");

-- CreateIndex
CREATE INDEX "ClientBrief_status_idx" ON "ClientBrief"("status");

-- CreateIndex
CREATE INDEX "ClientBrief_assignedToId_idx" ON "ClientBrief"("assignedToId");

-- CreateIndex
CREATE INDEX "ContentPost_platform_idx" ON "ContentPost"("platform");

-- CreateIndex
CREATE INDEX "ContentPost_status_idx" ON "ContentPost"("status");

-- CreateIndex
CREATE INDEX "ContentPost_internalReviewStatus_idx" ON "ContentPost"("internalReviewStatus");

-- CreateIndex
CREATE INDEX "ContentPost_scheduledDate_idx" ON "ContentPost"("scheduledDate");

-- CreateIndex
CREATE INDEX "ContentPost_userId_idx" ON "ContentPost"("userId");

-- CreateIndex
CREATE INDEX "ContentPost_clientId_idx" ON "ContentPost"("clientId");

-- CreateIndex
CREATE INDEX "PostVersion_postId_idx" ON "PostVersion"("postId");

-- CreateIndex
CREATE INDEX "PostVersion_createdById_idx" ON "PostVersion"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "PostVersion_postId_versionNumber_key" ON "PostVersion"("postId", "versionNumber");

-- CreateIndex
CREATE INDEX "PostFeedback_postId_idx" ON "PostFeedback"("postId");

-- CreateIndex
CREATE INDEX "PostFeedback_versionId_idx" ON "PostFeedback"("versionId");

-- CreateIndex
CREATE INDEX "PostFeedback_userId_idx" ON "PostFeedback"("userId");

-- CreateIndex
CREATE INDEX "ContentAttachment_postId_idx" ON "ContentAttachment"("postId");

-- CreateIndex
CREATE INDEX "Contract_clientId_idx" ON "Contract"("clientId");

-- CreateIndex
CREATE INDEX "Contract_status_idx" ON "Contract"("status");

-- CreateIndex
CREATE INDEX "Contract_startDate_idx" ON "Contract"("startDate");

-- CreateIndex
CREATE INDEX "Proposal_clientId_idx" ON "Proposal"("clientId");

-- CreateIndex
CREATE INDEX "Proposal_status_idx" ON "Proposal"("status");

-- CreateIndex
CREATE INDEX "Proposal_validUntil_idx" ON "Proposal"("validUntil");

-- CreateIndex
CREATE INDEX "ProposalItem_proposalId_idx" ON "ProposalItem"("proposalId");

-- CreateIndex
CREATE INDEX "ProposalProject_proposalId_idx" ON "ProposalProject"("proposalId");

-- CreateIndex
CREATE INDEX "Asset_clientId_idx" ON "Asset"("clientId");

-- CreateIndex
CREATE INDEX "Asset_fileType_idx" ON "Asset"("fileType");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "art_type_pricing_art_type_key" ON "art_type_pricing"("art_type");

-- CreateIndex
CREATE INDEX "calendar_entries_client_id_idx" ON "calendar_entries"("client_id");

-- CreateIndex
CREATE INDEX "calendar_entries_year_month_idx" ON "calendar_entries"("year", "month");

-- CreateIndex
CREATE INDEX "calendar_entries_designer_id_idx" ON "calendar_entries"("designer_id");

-- CreateIndex
CREATE INDEX "agenda_events_event_date_idx" ON "agenda_events"("event_date");

-- CreateIndex
CREATE INDEX "agenda_events_created_by_idx" ON "agenda_events"("created_by");

-- CreateIndex
CREATE INDEX "agenda_confirmations_user_id_idx" ON "agenda_confirmations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "agenda_confirmations_event_id_user_id_key" ON "agenda_confirmations"("event_id", "user_id");

-- CreateIndex
CREATE INDEX "client_requests_client_id_idx" ON "client_requests"("client_id");

-- CreateIndex
CREATE INDEX "client_requests_status_idx" ON "client_requests"("status");

-- CreateIndex
CREATE INDEX "client_reports_client_id_idx" ON "client_reports"("client_id");

-- CreateIndex
CREATE INDEX "client_reports_status_idx" ON "client_reports"("status");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userGroupId_fkey" FOREIGN KEY ("userGroupId") REFERENCES "UserGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FinancialCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanbanTask" ADD CONSTRAINT "KanbanTask_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanbanTask" ADD CONSTRAINT "KanbanTask_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "KanbanColumn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanbanTask" ADD CONSTRAINT "KanbanTask_contentPostId_fkey" FOREIGN KEY ("contentPostId") REFERENCES "ContentPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanbanTask" ADD CONSTRAINT "KanbanTask_calendarEventId_fkey" FOREIGN KEY ("calendarEventId") REFERENCES "CalendarEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanbanTask" ADD CONSTRAINT "KanbanTask_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanbanTaskAsset" ADD CONSTRAINT "KanbanTaskAsset_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "KanbanTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanbanTaskAsset" ADD CONSTRAINT "KanbanTaskAsset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanbanTaskAssignee" ADD CONSTRAINT "KanbanTaskAssignee_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "KanbanTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanbanTaskAssignee" ADD CONSTRAINT "KanbanTaskAssignee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "KanbanTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskComment" ADD CONSTRAINT "TaskComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskHistory" ADD CONSTRAINT "TaskHistory_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "KanbanTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskHistory" ADD CONSTRAINT "TaskHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_contentPostId_fkey" FOREIGN KEY ("contentPostId") REFERENCES "ContentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_clientGroupId_fkey" FOREIGN KEY ("clientGroupId") REFERENCES "ClientGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroupMember" ADD CONSTRAINT "UserGroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroupMember" ADD CONSTRAINT "UserGroupMember_userGroupId_fkey" FOREIGN KEY ("userGroupId") REFERENCES "UserGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReport" ADD CONSTRAINT "ClientReport_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReport" ADD CONSTRAINT "ClientReport_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPortalToken" ADD CONSTRAINT "ClientPortalToken_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPortalUser" ADD CONSTRAINT "ClientPortalUser_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPortalAuthToken" ADD CONSTRAINT "ClientPortalAuthToken_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "ClientPortalUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientBrief" ADD CONSTRAINT "ClientBrief_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientBrief" ADD CONSTRAINT "ClientBrief_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPost" ADD CONSTRAINT "ContentPost_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPost" ADD CONSTRAINT "ContentPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPost" ADD CONSTRAINT "ContentPost_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVersion" ADD CONSTRAINT "PostVersion_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ContentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVersion" ADD CONSTRAINT "PostVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFeedback" ADD CONSTRAINT "PostFeedback_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ContentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFeedback" ADD CONSTRAINT "PostFeedback_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "PostVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFeedback" ADD CONSTRAINT "PostFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAttachment" ADD CONSTRAINT "ContentAttachment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ContentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalItem" ADD CONSTRAINT "ProposalItem_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalProject" ADD CONSTRAINT "ProposalProject_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_entries" ADD CONSTRAINT "calendar_entries_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda_confirmations" ADD CONSTRAINT "agenda_confirmations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "agenda_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_requests" ADD CONSTRAINT "client_requests_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_reports" ADD CONSTRAINT "client_reports_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

