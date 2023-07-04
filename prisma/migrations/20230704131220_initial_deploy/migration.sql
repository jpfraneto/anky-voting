-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "description" TEXT,
    "tokenId" INTEGER,
    "attributes" JSONB,
    "upscaledImageUrls" TEXT[],
    "cloudinaryLinks" TEXT[],
    "chosenImageUrl" TEXT,
    "readyToMint" BOOLEAN NOT NULL DEFAULT false,
    "addedToIPFS" BOOLEAN NOT NULL DEFAULT false,
    "uploadedImageToIPFS" BOOLEAN NOT NULL DEFAULT false,
    "imageCID" TEXT,
    "uploadedJSONToIPFS" BOOLEAN NOT NULL DEFAULT false,
    "jsonCID" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
