DROP TABLE IF EXISTS `order_details`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `password_resets`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `etat`;
DROP TABLE IF EXISTS `event`;
DROP TABLE IF EXISTS `event_image`;
DROP TABLE IF EXISTS `newsletters`;

CREATE TABLE `categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `categories` (`nom`, `description`) VALUES
('Catégorie A', 'Description pour la catégorie A'),
('Catégorie B', 'Description pour la catégorie B'),
('Catégorie C', 'Description pour la catégorie C');

CREATE TABLE `roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `roles` (`name`) VALUES ('User'), ('Admin');

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `dateCreated` DATE NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `roleId` INT NOT NULL,
  `phone` VARCHAR(20),
  `address` VARCHAR(255),
  `zip` VARCHAR(20),
  `country` VARCHAR(100),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `password_resets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255),
  `prix_ht` DECIMAL(10,2) NOT NULL,
  `prix_ttc` DECIMAL(10,2) NOT NULL,
  `quantite` INT NOT NULL,
  `image` VARCHAR(255),
  `category_id` INT NOT NULL,
  `actif` BOOLEAN NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `etat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `etat` (`name`) VALUES
('en attente'),
('en cours de préparation'),
('en cours de livraison'),
('terminée');

CREATE TABLE `orders` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `total_ttc` DECIMAL(10,2) NOT NULL,
  `date_commande` DATETIME NOT NULL,
  `etat_id` INT NOT NULL,
  `stripeId` VARCHAR(250) NOT NULL,
  `payment_success` BOOLEAN NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `order_details` (
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantite` INT NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `type_event` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `type_event` (`name`) VALUES ('Tractage'), ('Manifestation'), ('Conférence');

CREATE TABLE `event` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(100) NOT NULL,
  `date` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `description` TEXT,
  `image` VARCHAR(255),
  `actif` BOOLEAN NOT NULL,
  `type_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`type_id`) REFERENCES `type_event` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `event_image` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `event_id` INT NOT NULL,
  `image` VARCHAR(255),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`event_id`) REFERENCES `event`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `newsletters` (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

