-- Suppression des données existantes
TRUNCATE TABLE "user_token" CASCADE;
TRUNCATE TABLE "profile" CASCADE;
TRUNCATE TABLE "user" CASCADE;
TRUNCATE TABLE "category" CASCADE;
TRUNCATE TABLE "product" CASCADE;
TRUNCATE TABLE "variant" CASCADE;
TRUNCATE TABLE "store" CASCADE;
TRUNCATE TABLE "store_variant" CASCADE;
TRUNCATE TABLE "cart" CASCADE;
TRUNCATE TABLE "order" CASCADE;
TRUNCATE TABLE "order_item" CASCADE;

-- Insertion des utilisateurs
INSERT INTO "user" (id, email, password, firstname, lastname, role) VALUES
(1, 'admin@peakrent.com', '$2b$10$X7Q8Y9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z', 'Admin', 'User', 'admin'),
(2, 'client@example.com', '$2b$10$X7Q8Y9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z', 'Jean', 'Dupont', 'user'),
(3, 'store@peakrent.com', '$2b$10$X7Q8Y9Z0A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z', 'Pierre', 'Martin', 'store');

-- Insertion des profils
INSERT INTO "profile" (user_id, email, firstname, lastname, role) VALUES
(1, 'admin@peakrent.com', 'Admin', 'User', 'admin'),
(2, 'client@example.com', 'Jean', 'Dupont', 'user'),
(3, 'store@peakrent.com', 'Pierre', 'Martin', 'store');

-- Insertion des catégories
INSERT INTO "category" (id, name, normalized_name, url_image, created_by) VALUES
(1, 'Ski Alpin', 'ski-alpin', 'https://example.com/images/ski-alpin.jpg', 1),
(2, 'Snowboard', 'snowboard', 'https://example.com/images/snowboard.jpg', 1),
(3, 'Raquettes', 'raquettes', 'https://example.com/images/raquettes.jpg', 1),
(4, 'Chaussures', 'chaussures', 'https://example.com/images/chaussures.jpg', 1),
(5, 'Vêtements', 'vetements', 'https://example.com/images/vetements.jpg', 1);

-- Insertion des produits
INSERT INTO "product" (id, name, normalized_name, description, url_image, is_published, sku, created_by) VALUES
-- Skis Alpin
(1, 'Ski Rossignol Hero Elite', 'ski-rossignol-hero-elite', 'Ski de compétition pour skieurs confirmés', 'https://example.com/images/rossignol-hero.jpg', true, 'SKI-001', 3),
(2, 'Ski Atomic Redster S9', 'ski-atomic-redster-s9', 'Ski carving pour skieurs intermédiaires', 'https://example.com/images/atomic-redster.jpg', true, 'SKI-002', 3),
(3, 'Ski Salomon QST 98', 'ski-salomon-qst-98', 'Ski tout-montagne pour le freeride', 'https://example.com/images/salomon-qst.jpg', true, 'SKI-003', 3),
-- Snowboards
(4, 'Snowboard Burton Custom', 'snowboard-burton-custom', 'Snowboard polyvalent pour tous les niveaux', 'https://example.com/images/burton-custom.jpg', true, 'SNB-001', 3),
(5, 'Snowboard Jones Mountain Twin', 'snowboard-jones-mountain-twin', 'Snowboard freeride pour la poudreuse', 'https://example.com/images/jones-mountain.jpg', true, 'SNB-002', 3),
(6, 'Snowboard Nitro T1', 'snowboard-nitro-t1', 'Snowboard freestyle pour le park', 'https://example.com/images/nitro-t1.jpg', true, 'SNB-003', 3),
-- Raquettes
(7, 'Raquettes TSL Symbioz', 'raquettes-tsl-symbioz', 'Raquettes légères pour randonnée', 'https://example.com/images/tsl-symbioz.jpg', true, 'RAQ-001', 3),
(8, 'Raquettes MSR Lightning Ascent', 'raquettes-msr-lightning', 'Raquettes techniques pour terrain escarpé', 'https://example.com/images/msr-lightning.jpg', true, 'RAQ-002', 3),
(9, 'Raquettes Tubbs Flex VRT', 'raquettes-tubbs-flex', 'Raquettes confortables pour débutants', 'https://example.com/images/tubbs-flex.jpg', true, 'RAQ-003', 3),
-- Chaussures
(10, 'Chaussures Salomon S/Max', 'chaussures-salomon-smax', 'Chaussures de ski confortables et performantes', 'https://example.com/images/salomon-smax.jpg', true, 'CHS-001', 3),
(11, 'Chaussures Rossignol Alltrack Pro', 'chaussures-rossignol-alltrack', 'Chaussures de ski pour la compétition', 'https://example.com/images/rossignol-alltrack.jpg', true, 'CHS-002', 3),
(12, 'Chaussures Atomic Hawx Prime', 'chaussures-atomic-hawx', 'Chaussures de ski pour le freeride', 'https://example.com/images/atomic-hawx.jpg', true, 'CHS-003', 3),
-- Vêtements
(13, 'Veste Gore-Tex Arc''teryx', 'veste-goretex-arcteryx', 'Veste imperméable et respirante', 'https://example.com/images/arcteryx-veste.jpg', true, 'VET-001', 3),
(14, 'Pantalon de ski The North Face', 'pantalon-north-face', 'Pantalon de ski chaud et imperméable', 'https://example.com/images/north-face-pantalon.jpg', true, 'VET-002', 3),
(15, 'Combinaison de ski Picture', 'combinaison-picture', 'Combinaison de ski pour le freestyle', 'https://example.com/images/picture-combinaison.jpg', true, 'VET-003', 3);

-- Insertion des variantes
INSERT INTO "variant" (id, size, color, price_per_hour, product_id, created_by) VALUES
-- Skis Rossignol Hero Elite
(1, '165cm', 'Rouge/Noir', 15.00, 1, 3),
(2, '170cm', 'Bleu/Noir', 15.00, 1, 3),
-- Skis Atomic Redster S9
(3, '168cm', 'Rouge/Blanc', 14.00, 2, 3),
(4, '175cm', 'Noir/Or', 14.00, 2, 3),
-- Skis Salomon QST 98
(5, '172cm', 'Vert/Noir', 16.00, 3, 3),
(6, '180cm', 'Bleu/Noir', 16.00, 3, 3),
-- Snowboards Burton Custom
(7, '155cm', 'Noir/Blanc', 12.00, 4, 3),
(8, '160cm', 'Vert/Noir', 12.00, 4, 3),
-- Snowboards Jones Mountain Twin
(9, '158cm', 'Bleu/Noir', 13.00, 5, 3),
(10, '162cm', 'Rouge/Noir', 13.00, 5, 3),
-- Snowboards Nitro T1
(11, '152cm', 'Noir/Or', 11.00, 6, 3),
(12, '156cm', 'Blanc/Noir', 11.00, 6, 3),
-- Raquettes TSL Symbioz
(13, 'M', 'Noir', 8.00, 7, 3),
(14, 'L', 'Bleu', 8.00, 7, 3),
-- Raquettes MSR Lightning
(15, 'M', 'Rouge', 9.00, 8, 3),
(16, 'L', 'Noir', 9.00, 8, 3),
-- Raquettes Tubbs Flex
(17, 'M', 'Vert', 7.00, 9, 3),
(18, 'L', 'Bleu', 7.00, 9, 3),
-- Chaussures Salomon S/Max
(19, '42', 'Noir', 10.00, 10, 3),
(20, '43', 'Noir', 10.00, 10, 3),
-- Chaussures Rossignol Alltrack
(21, '41', 'Rouge', 11.00, 11, 3),
(22, '42', 'Rouge', 11.00, 11, 3),
-- Chaussures Atomic Hawx
(23, '42', 'Noir', 12.00, 12, 3),
(24, '43', 'Noir', 12.00, 12, 3),
-- Veste Arc''teryx
(25, 'M', 'Noir', 12.00, 13, 3),
(26, 'L', 'Noir', 12.00, 13, 3),
-- Pantalon The North Face
(27, 'M', 'Noir', 10.00, 14, 3),
(28, 'L', 'Noir', 10.00, 14, 3),
-- Combinaison Picture
(29, 'M', 'Bleu', 15.00, 15, 3),
(30, 'L', 'Bleu', 15.00, 15, 3);

-- Insertion du magasin
INSERT INTO "store" (id, name, phone_number, address_1, address_2, city, zip_code, country, reference, created_by) VALUES
(1, 'PeakRent Chamonix', '+33456789012', '123 Avenue de l''Aiguille du Midi', 'Bâtiment A', 'Chamonix', '74400', 'France', 'STORE-001', 3);

-- Insertion des variantes de magasin
INSERT INTO "store_variant" (variant_id, store_id, quantity) VALUES
-- Skis
(1, 1, 10),
(2, 1, 8),
(3, 1, 12),
(4, 1, 10),
(5, 1, 8),
(6, 1, 6),
-- Snowboards
(7, 1, 10),
(8, 1, 8),
(9, 1, 6),
(10, 1, 4),
(11, 1, 8),
(12, 1, 6),
-- Raquettes
(13, 1, 15),
(14, 1, 12),
(15, 1, 10),
(16, 1, 8),
(17, 1, 12),
(18, 1, 10),
-- Chaussures
(19, 1, 20),
(20, 1, 20),
(21, 1, 15),
(22, 1, 15),
(23, 1, 15),
(24, 1, 15),
-- Vêtements
(25, 1, 10),
(26, 1, 8),
(27, 1, 12),
(28, 1, 10),
(29, 1, 8),
(30, 1, 6);

-- Insertion des paniers
INSERT INTO "cart" (id, profile_id, address_1, address_2, city, zip_code, country) VALUES
(1, 2, '789 Rue des Neiges', 'Appartement 3C', 'Chamonix', '74400', 'France');

-- Insertion des commandes
INSERT INTO "order" (id, reference, status, payment_method, address_1, address_2, city, zip_code, country, profile_id) VALUES
(1, 'ORD-001', 'confirmed', 'card', '789 Rue des Neiges', 'Appartement 3C', 'Chamonix', '74400', 'France', 2);

-- Insertion des éléments de commande
INSERT INTO "order_item" (id, order_id, variant_id, quantity, price_per_hour, starts_at, ends_at) VALUES
(1, 1, 1, 1, 15.00, '2024-01-01 09:00:00', '2024-01-01 17:00:00'),
(2, 1, 7, 1, 10.00, '2024-01-01 09:00:00', '2024-01-01 17:00:00');
