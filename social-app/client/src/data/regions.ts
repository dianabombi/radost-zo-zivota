export interface RegionOption {
  value: string;
  label: string;
}

export const SLOVAKIA_REGIONS: RegionOption[] = [
  { value: 'bratislavsky', label: 'Bratislavský kraj' },
  { value: 'trnavsky', label: 'Trnavský kraj' },
  { value: 'trenciansky', label: 'Trenčiansky kraj' },
  { value: 'nitriansky', label: 'Nitriansky kraj' },
  { value: 'zilinsky', label: 'Žilinský kraj' },
  { value: 'banskobystricky', label: 'Banskobystrický kraj' },
  { value: 'presovsky', label: 'Prešovský kraj' },
  { value: 'kosicky', label: 'Košický kraj' },
];

export const CZECH_REGIONS: RegionOption[] = [
  { value: 'praha', label: 'Praha' },
  { value: 'stredocesky', label: 'Středočeský kraj' },
  { value: 'jihocesky', label: 'Jihočeský kraj' },
  { value: 'plzensky', label: 'Plzeňský kraj' },
  { value: 'karlovarsky', label: 'Karlovarský kraj' },
  { value: 'ustecky', label: 'Ústecký kraj' },
  { value: 'liberecky', label: 'Liberecký kraj' },
  { value: 'kralovehradecky', label: 'Královéhradecký kraj' },
  { value: 'pardubicky', label: 'Pardubický kraj' },
  { value: 'vysocina', label: 'Kraj Vysočina' },
  { value: 'jihomoravsky', label: 'Jihomoravský kraj' },
  { value: 'olomoucky', label: 'Olomoucký kraj' },
  { value: 'zlinsky', label: 'Zlínský kraj' },
  { value: 'moravskoslezsky', label: 'Moravskoslezský kraj' },
];

export const COUNTRIES: RegionOption[] = [
  // Prioritized: Slovakia and Czech Republic
  { value: 'Slovakia', label: '🇸🇰 Slovensko' },
  { value: 'Czech Republic', label: '🇨🇿 Česká republika' },
  { value: '---', label: '──────────────', disabled: true } as any,
  // Popular gaming countries in Europe
  { value: 'Poland', label: '🇵🇱 Poľsko' },
  { value: 'Germany', label: '🇩🇪 Nemecko' },
  { value: 'Austria', label: '🇦🇹 Rakúsko' },
  { value: 'Hungary', label: '🇭🇺 Maďarsko' },
  { value: 'United Kingdom', label: '🇬🇧 Veľká Británia' },
  { value: 'France', label: '🇫🇷 Francúzsko' },
  { value: 'Spain', label: '🇪🇸 Španielsko' },
  { value: 'Italy', label: '🇮🇹 Taliansko' },
  { value: 'Netherlands', label: '🇳🇱 Holandsko' },
  { value: 'Belgium', label: '🇧🇪 Belgicko' },
  { value: 'Switzerland', label: '🇨🇭 Švajčiarsko' },
  { value: 'Sweden', label: '🇸🇪 Švédsko' },
  { value: 'Norway', label: '🇳🇴 Nórsko' },
  { value: 'Denmark', label: '🇩🇰 Dánsko' },
  { value: 'Finland', label: '🇫🇮 Fínsko' },
  { value: '---2', label: '──────────────', disabled: true } as any,
  // Other popular regions
  { value: 'United States', label: '🇺🇸 USA' },
  { value: 'Canada', label: '🇨🇦 Kanada' },
  { value: 'Australia', label: '🇦🇺 Austrália' },
  { value: 'Other', label: '🌍 Iné' },
];

export const getRegionsByCountry = (country: string): RegionOption[] => {
  switch (country) {
    case 'Slovakia':
      return SLOVAKIA_REGIONS;
    case 'Czech Republic':
      return CZECH_REGIONS;
    default:
      return [];
  }
};
