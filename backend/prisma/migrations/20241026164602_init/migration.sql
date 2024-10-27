-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "item_code" TEXT NOT NULL,
    "item_description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "opening_stock" INTEGER NOT NULL DEFAULT 0,
    "last_updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "low_stock_warning" BOOLEAN NOT NULL DEFAULT false,
    "low_stock_units" INTEGER,
    "price" INTEGER NOT NULL,
    "gst_tax_rate" TEXT,
    "inclusive_of_tax" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemImages" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,

    CONSTRAINT "ItemImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItemImages" ADD CONSTRAINT "ItemImages_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
