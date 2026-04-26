/**
 * 14 Uzbek regions — names, capitals, geocoords, population. All values are
 * open-source. The ПП-314 region-state twinning matrix is intentionally
 * NOT modeled here; once MFA + Khokimiyats publish the official pairings,
 * extend this module with a `pairings` field referencing real US states.
 */
export interface UzRegion {
  id: string;
  nameEn: string;
  nameRu: string;
  nameUz: string;
  capital: string;
  lat: number;
  lng: number;
  populationMillions: number;
  is_demo: boolean;
}

export const uzRegions: UzRegion[] = [
  { id: "tashkent-city", nameEn: "Tashkent (city)", nameRu: "г. Ташкент", nameUz: "Toshkent shahri", capital: "Tashkent", lat: 41.2995, lng: 69.2401, populationMillions: 2.9, is_demo: false },
  { id: "tashkent", nameEn: "Tashkent region", nameRu: "Ташкентская область", nameUz: "Toshkent viloyati", capital: "Nurafshon", lat: 41.0, lng: 69.8, populationMillions: 3.0, is_demo: false },
  { id: "andijan", nameEn: "Andijan", nameRu: "Андижанская область", nameUz: "Andijon viloyati", capital: "Andijan", lat: 40.7821, lng: 72.3442, populationMillions: 3.3, is_demo: false },
  { id: "bukhara", nameEn: "Bukhara", nameRu: "Бухарская область", nameUz: "Buxoro viloyati", capital: "Bukhara", lat: 39.7747, lng: 64.4286, populationMillions: 2.0, is_demo: false },
  { id: "fergana", nameEn: "Fergana", nameRu: "Ферганская область", nameUz: "Farg‘ona viloyati", capital: "Fergana", lat: 40.3844, lng: 71.7892, populationMillions: 3.9, is_demo: false },
  { id: "jizzakh", nameEn: "Jizzakh", nameRu: "Джизакская область", nameUz: "Jizzax viloyati", capital: "Jizzakh", lat: 40.1158, lng: 67.8422, populationMillions: 1.5, is_demo: false },
  { id: "karakalpakstan", nameEn: "Karakalpakstan", nameRu: "Республика Каракалпакстан", nameUz: "Qoraqalpog‘iston Respublikasi", capital: "Nukus", lat: 42.4667, lng: 59.6000, populationMillions: 1.9, is_demo: false },
  { id: "kashkadarya", nameEn: "Kashkadarya", nameRu: "Кашкадарьинская область", nameUz: "Qashqadaryo viloyati", capital: "Karshi", lat: 38.8606, lng: 65.7886, populationMillions: 3.5, is_demo: false },
  { id: "khorezm", nameEn: "Khorezm", nameRu: "Хорезмская область", nameUz: "Xorazm viloyati", capital: "Urgench", lat: 41.5500, lng: 60.6333, populationMillions: 1.9, is_demo: false },
  { id: "namangan", nameEn: "Namangan", nameRu: "Наманганская область", nameUz: "Namangan viloyati", capital: "Namangan", lat: 40.9983, lng: 71.6726, populationMillions: 2.9, is_demo: false },
  { id: "navoi", nameEn: "Navoi", nameRu: "Навоийская область", nameUz: "Navoiy viloyati", capital: "Navoi", lat: 40.1033, lng: 65.3739, populationMillions: 1.0, is_demo: false },
  { id: "samarkand", nameEn: "Samarkand", nameRu: "Самаркандская область", nameUz: "Samarqand viloyati", capital: "Samarkand", lat: 39.6542, lng: 66.9597, populationMillions: 4.0, is_demo: false },
  { id: "surkhandarya", nameEn: "Surkhandarya", nameRu: "Сурхандарьинская область", nameUz: "Surxondaryo viloyati", capital: "Termez", lat: 37.2242, lng: 67.2783, populationMillions: 2.7, is_demo: false },
  { id: "sirdarya", nameEn: "Sirdarya", nameRu: "Сырдарьинская область", nameUz: "Sirdaryo viloyati", capital: "Guliston", lat: 40.4900, lng: 68.7828, populationMillions: 0.9, is_demo: false },
];

export const usMajorCities = [
  { name: "New York", lat: 40.7128, lng: -74.006, state: "NY" },
  { name: "Washington, DC", lat: 38.9072, lng: -77.0369, state: "DC" },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437, state: "CA" },
  { name: "Houston", lat: 29.7604, lng: -95.3698, state: "TX" },
  { name: "Chicago", lat: 41.8781, lng: -87.6298, state: "IL" },
  { name: "Miami", lat: 25.7617, lng: -80.1918, state: "FL" },
  { name: "Boston", lat: 42.3601, lng: -71.0589, state: "MA" },
  { name: "Atlanta", lat: 33.749, lng: -84.388, state: "GA" },
];
