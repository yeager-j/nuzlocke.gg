-- CreateTable
CREATE TABLE "Species" (
    "id" SERIAL NOT NULL,
    "nationalDexNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "speciesId" INTEGER NOT NULL,
    "formName" TEXT NOT NULL,
    "movePool" TEXT NOT NULL,
    "evolvesFromFormName" TEXT,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mode" (
    "id" SERIAL NOT NULL,
    "formName" TEXT NOT NULL,
    "modeName" TEXT NOT NULL,
    "sprite" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "types" TEXT NOT NULL,
    "baseStats" TEXT NOT NULL,
    "abilities" TEXT NOT NULL,

    CONSTRAINT "Mode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Species_nationalDexNumber_key" ON "Species"("nationalDexNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Species_name_key" ON "Species"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Form_formName_key" ON "Form"("formName");

-- CreateIndex
CREATE UNIQUE INDEX "Mode_modeName_key" ON "Mode"("modeName");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_evolvesFromFormName_fkey" FOREIGN KEY ("evolvesFromFormName") REFERENCES "Form"("formName") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mode" ADD CONSTRAINT "Mode_formName_fkey" FOREIGN KEY ("formName") REFERENCES "Form"("formName") ON DELETE RESTRICT ON UPDATE CASCADE;
