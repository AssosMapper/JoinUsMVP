import { Localisation } from "./../types/localisation";
/**
 * Formate une adresse complète à partir d'un objet localisation
 * @param localisation - Objet localisation contenant les informations d'adresse
 * @returns Adresse formatée sous forme de chaîne
 */
export function formatFullAddress(
  localisation: Localisation | null | undefined
): string {
  if (!localisation) return "";

  const parts: string[] = [];

  // Numéro et nom de rue
  if (localisation.street_number && localisation.street_name) {
    parts.push(`${localisation.street_number} ${localisation.street_name}`);
  } else if (localisation.street_name) {
    parts.push(localisation.street_name);
  }

  // Code postal et ville
  if (localisation.zip && localisation.city) {
    parts.push(`${localisation.zip} ${localisation.city}`);
  } else if (localisation.city) {
    parts.push(localisation.city);
  }

  // Pays (optionnel, généralement omis pour les adresses locales)
  if (localisation.country && localisation.country.toLowerCase() !== "france") {
    parts.push(localisation.country);
  }

  return parts.join(", ");
}

/**
 * Formate une adresse courte (ville uniquement ou ville + code postal)
 * @param localisation - Objet localisation
 * @returns Adresse courte formatée
 */
export function formatShortAddress(
  localisation: Localisation | null | undefined
): string {
  if (!localisation) return "";

  if (localisation.zip && localisation.city) {
    return `${localisation.zip} ${localisation.city}`;
  }

  return localisation.city || "";
}

/**
 * Formate uniquement la rue (numéro + nom)
 * @param localisation - Objet localisation
 * @returns Rue formatée
 */
export function formatStreet(
  localisation: Localisation | null | undefined
): string {
  if (!localisation) return "";

  if (localisation.street_number && localisation.street_name) {
    return `${localisation.street_number} ${localisation.street_name}`;
  }

  return localisation.street_name || "";
}

/**
 * Vérifie si une localisation est complète (contient au minimum ville)
 * @param localisation - Objet localisation
 * @returns true si la localisation est valide
 */
export function isValidAddress(
  localisation: Localisation | null | undefined
): boolean {
  return !!localisation?.city;
}

/**
 * Formate une adresse pour affichage sur une seule ligne avec séparateurs
 * @param localisation - Objet localisation
 * @param separator - Séparateur à utiliser (par défaut: ' • ')
 * @returns Adresse formatée sur une ligne
 */
export function formatInlineAddress(
  localisation: Localisation | null | undefined,
  separator: string = " • "
): string {
  if (!localisation) return "";

  const parts: string[] = [];

  // Rue
  const street = formatStreet(localisation);
  if (street) parts.push(street);

  // Ville
  if (localisation.city) parts.push(localisation.city);

  return parts.join(separator);
}
