import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Building2, Globe } from 'lucide-react';

interface CityInfoProps {
  citySlug: string;
  cityName: string;
  countryCode: string;
  population?: number;
  businessCount?: number;
}

// Country flag emojis and coat of arms URLs
const countryFlags: Record<string, string> = {
  'RW': '🇷🇼', // Rwanda
  'KE': '🇰🇪', // Kenya
  'UG': '🇺🇬', // Uganda
  'TZ': '🇹🇿', // Tanzania
  'ET': '🇪🇹', // Ethiopia
  'GH': '🇬🇭', // Ghana
  'NG': '🇳🇬', // Nigeria
  'ZA': '🇿🇦', // South Africa
  'EG': '🇪🇬', // Egypt
  'MA': '🇲🇦', // Morocco
};

// Coat of arms URLs (using Wikipedia Commons)
const coatOfArms: Record<string, string> = {
  'RW': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Coat_of_arms_of_Rwanda.svg',
  'KE': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Coat_of_arms_of_Kenya.svg',
  'UG': 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Coat_of_arms_of_Uganda.svg',
  'TZ': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Coat_of_arms_of_Tanzania.svg',
  'ET': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Coat_of_arms_of_Ethiopia.svg',
  'GH': 'https://upload.wikimedia.org/wikipedia/commons/7/79/Coat_of_arms_of_Ghana.svg',
  'NG': 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Coat_of_arms_of_Nigeria.svg',
  'ZA': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Coat_of_arms_of_South_Africa.svg',
  'EG': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Coat_of_arms_of_Egypt.svg',
  'MA': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Coat_of_arms_of_Morocco.svg',
};

export const CityInfo: React.FC<CityInfoProps> = ({
  citySlug,
  cityName,
  countryCode,
  population,
  businessCount
}) => {
  const { t } = useTranslation();
  
  // Get city description from translations
  const cityDescription = t(`cityDetail.cities.${citySlug}`, '');
  const flag = countryFlags[countryCode] || '🏳️';
  const coatOfArmsUrl = coatOfArms[countryCode];

  if (!cityDescription) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{flag}</span>
            {coatOfArmsUrl && (
              <img 
                src={coatOfArmsUrl} 
                alt={`Coat of arms of ${countryCode}`}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  // Hide image if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl font-comfortaa text-yp-dark">
              {cityName}
            </CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              {population && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{population.toLocaleString()}</span>
                </Badge>
              )}
              {businessCount && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Building2 className="w-3 h-3" />
                  <span>{businessCount} {t('cityDetail.businesses')}</span>
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center space-x-1">
                <Globe className="w-3 h-3" />
                <span>{countryCode}</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-yp-blue mt-1 flex-shrink-0" />
          <div className="text-gray-700 leading-relaxed">
            {cityDescription}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
