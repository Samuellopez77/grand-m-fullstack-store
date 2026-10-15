-- RLS on every new table (RULES.md, Database)
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Data integrity (SRS, data integrity requirement)
ALTER TABLE public.products ADD CONSTRAINT products_stock_nonnegative CHECK (stock >= 0);
ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_quantity_positive CHECK (quantity > 0);
ALTER TABLE public.order_items ADD CONSTRAINT order_items_quantity_positive CHECK (quantity > 0);