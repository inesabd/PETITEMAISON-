-- Seed data pour PETITEMAISON - Produits horrifiques
-- Exécuter après schema.sql pour peupler la base

-- Vider les produits existants
DELETE FROM public.produits;

-- ============================================
-- FIGURINES
-- ============================================
INSERT INTO public.produits (titre, description, categorie, prix, image_url) VALUES
('Figurine Evil Ed', 'Édition collector limitée à 500 exemplaires. Figurine articulée 30cm avec accessoires.', 'Figurines', 89.00, NULL),
('Pennywise Ultimate', 'Figurine NECA 18cm du clown de Ça. Visage interchangeable inclus.', 'Figurines', 45.00, NULL),
('Michael Myers 1978', 'Figurine collector Halloween. Masque amovible, couteau inclus.', 'Figurines', 65.00, NULL),
('Freddy Krueger Deluxe', 'Figurine articulée avec gant aux griffes métalliques. Édition 40ème anniversaire.', 'Figurines', 75.00, NULL),
('Jason Voorhees', 'Figurine Vendredi 13 Part III. Masque de hockey et machette.', 'Figurines', 55.00, NULL),
('Leatherface Premium', 'Figurine Massacre à la tronçonneuse. Tronçonneuse détaillée.', 'Figurines', 85.00, NULL),
('Ghostface Scream', 'Figurine 25cm avec cape en tissu et téléphone.', 'Figurines', 42.00, NULL),
('Chucky Good Guy', 'Réplique fidèle de la poupée. Yeux mobiles, cheveux implantés.', 'Figurines', 120.00, NULL);

-- ============================================
-- BLU-RAY
-- ============================================
INSERT INTO public.produits (titre, description, categorie, prix, image_url) VALUES
('Coffret John Carpenter', 'Intégrale 8 films restaurés 4K. Bonus exclusifs et livret 100 pages.', 'Blu-ray', 149.00, NULL),
('Halloween 4K Steelbook', 'Édition limitée 45ème anniversaire. Nouveau master approuvé.', 'Blu-ray', 34.00, NULL),
('Shining 4K Collector', 'Version longue US + cinéma. Documentaire Making Of.', 'Blu-ray', 39.00, NULL),
('Alien Anthology', 'Les 4 films en coffret collector. Versions cinéma et director''s cut.', 'Blu-ray', 59.00, NULL),
('Exorciste Édition 50 ans', 'Restauration complète. 3 versions du film incluses.', 'Blu-ray', 44.00, NULL),
('Suspiria Restauré', 'Chef-d''œuvre de Dario Argento en 4K HDR. Couleurs éclatantes.', 'Blu-ray', 29.00, NULL),
('Evil Dead Trilogie', 'Les 3 films de Sam Raimi. Bonus : documentaire sur les effets.', 'Blu-ray', 49.00, NULL),
('Hellraiser Pinhead Box', 'Coffret des 4 premiers films avec boîtier Lament Configuration.', 'Blu-ray', 69.00, NULL);

-- ============================================
-- JEUX
-- ============================================
INSERT INTO public.produits (titre, description, categorie, prix, image_url) VALUES
('Mysterium', 'Jeu coopératif d''enquête paranormale. 2-7 joueurs, dès 10 ans.', 'Jeux', 39.00, NULL),
('Betrayal at House on the Hill', 'Exploration d''un manoir hanté avec 50 scénarios différents.', 'Jeux', 49.00, NULL),
('Zombicide Saison 1', 'Survivez à l''apocalypse zombie. Jeu coopératif avec figurines.', 'Jeux', 89.00, NULL),
('Horreur à Arkham JCE', 'Jeu de cartes évolutif Lovecraftien. Campagnes narratives.', 'Jeux', 55.00, NULL),
('Dead of Winter', 'Colonie de survivants avec traître potentiel. Ambiance tendue garantie.', 'Jeux', 59.00, NULL),
('Mansions of Madness', 'Enquête avec application. Figurines détaillées, scénarios variés.', 'Jeux', 99.00, NULL),
('Fury of Dracula', 'Un joueur est Dracula, les autres le chassent à travers l''Europe.', 'Jeux', 65.00, NULL),
('Nemesis', 'Survival horror spatial. Aliens, trahison et tension extrême.', 'Jeux', 149.00, NULL);

-- ============================================
-- LIVRES
-- ============================================
INSERT INTO public.produits (titre, description, categorie, prix, image_url) VALUES
('Shining - Stephen King', 'Édition collector reliée cuir. Illustrations exclusives.', 'Livres', 45.00, NULL),
('Ça - Intégrale', 'Les deux tomes en coffret. Nouvelle traduction 2023.', 'Livres', 55.00, NULL),
('L''Appel de Cthulhu', 'Œuvres complètes de Lovecraft. Édition annotée.', 'Livres', 35.00, NULL),
('Dracula - Bram Stoker', 'Édition illustrée par Ben Templesmith.', 'Livres', 29.00, NULL),
('Frankenstein Illustré', 'Édition bilingue avec gravures d''époque.', 'Livres', 32.00, NULL),
('World War Z', 'Max Brooks. Édition avec cartes et documents fictifs.', 'Livres', 24.00, NULL),
('L''Exorciste - William Blatty', 'Roman original. Préface inédite de l''auteur.', 'Livres', 19.00, NULL),
('House of Leaves', 'Mark Z. Danielewski. Édition française couleur.', 'Livres', 38.00, NULL);
