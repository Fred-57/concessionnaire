-- CreateTable
CREATE TABLE "_GuaranteeToPart" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_GuaranteeToPart_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GuaranteeToPart_B_index" ON "_GuaranteeToPart"("B");

-- AddForeignKey
ALTER TABLE "_GuaranteeToPart" ADD CONSTRAINT "_GuaranteeToPart_A_fkey" FOREIGN KEY ("A") REFERENCES "Guarantee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuaranteeToPart" ADD CONSTRAINT "_GuaranteeToPart_B_fkey" FOREIGN KEY ("B") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;
