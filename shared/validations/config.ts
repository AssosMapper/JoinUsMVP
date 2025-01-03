import { setLocale } from 'yup';

setLocale({
  mixed: {
    default: "Ce champ n'est pas valide",
    required: 'Ce champ est requis',
    oneOf: "Ce champ doit être l'une de ces valeurs : ${values}",
    notOneOf: "Ce champ ne doit pas être l'une de ces valeurs : ${values}",
  },
  string: {
    length: 'Ce champ doit contenir exactement ${length} caractères',
    min: 'Ce champ doit contenir au moins ${min} caractères',
    max: 'Ce champ doit contenir au maximum ${max} caractères',
    email: 'Ce champ doit être une adresse email valide',
    url: 'Ce champ doit être une URL valide',
    trim: "Ce champ ne doit pas contenir d'espaces au début ou à la fin",
    lowercase: 'Ce champ doit être en minuscules',
    uppercase: 'Ce champ doit être en majuscules',
    uuid: 'Ce champ doit être un UUID valide',
  },
  number: {
    min: 'Ce champ doit être supérieur ou égal à ${min}',
    max: 'Ce champ doit être inférieur ou égal à ${max}',
    lessThan: 'Ce champ doit être inférieur à ${less}',
    moreThan: 'Ce champ doit être supérieur à ${more}',
    positive: 'Ce champ doit être un nombre positif',
    negative: 'Ce champ doit être un nombre négatif',
    integer: 'Ce champ doit être un nombre entier',
  },
  date: {
    min: 'Ce champ doit être postérieur à ${min}',
    max: 'Ce champ doit être antérieur à ${max}',
  },
  array: {
    min: 'Ce champ doit contenir au moins ${min} éléments',
    max: 'Ce champ doit contenir au maximum ${max} éléments',
    length: 'Ce champ doit contenir exactement ${length} éléments',
  },
});
