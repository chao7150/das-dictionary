-- CreateTable
CREATE TABLE "Work" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Work.title_unique" ON "Work"("title");
