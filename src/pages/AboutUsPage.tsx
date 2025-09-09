import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Building, 
  Target, 
  Users, 
  Globe, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  Star,
  Award,
  Heart,
  Shield,
  Lightbulb,
  Zap,
  Eye,
  TrendingUp
} from "lucide-react";

const AboutUsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-yp-blue to-blue-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-comfortaa">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-roboto">
              {t('about.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-yp-blue hover:bg-gray-100 font-roboto">
                {t('about.hero.learnMore')}
              </Button>
              <Button size="lg" className="bg-white text-yp-blue hover:bg-gray-100 font-roboto">
                {t('about.hero.contactUs')}
              </Button>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-comfortaa">
                  {t('about.overview.title')}
                </h2>
                <p className="text-lg text-gray-600 mb-6 font-roboto">
                  {t('about.overview.description')}
                </p>
                <p className="text-lg text-gray-600 mb-6 font-roboto">
                  {t('about.overview.mission')}
                </p>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="text-sm font-roboto">
                    {t('about.overview.established')}
                  </Badge>
                  <Badge variant="secondary" className="text-sm font-roboto">
                    {t('about.overview.location')}
                  </Badge>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-yp-blue/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
                  <Building className="w-32 h-32 text-yp-blue/60" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Globe className="w-16 h-16 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-4">
                <div className="text-4xl font-bold text-yp-blue">100K+</div>
                <p className="text-gray-600 font-roboto">{t('about.stats.users')}</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-yp-blue">5K+</div>
                <p className="text-gray-600 font-roboto">{t('about.stats.businesses')}</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-yp-blue">50+</div>
                <p className="text-gray-600 font-roboto">{t('about.stats.cities')}</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-yp-blue">98%</div>
                <p className="text-gray-600 font-roboto">{t('about.stats.satisfaction')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-comfortaa">
                {t('about.values.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-roboto">
                {t('about.values.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-yp-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-comfortaa">{t('about.values.trust.title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 font-roboto">{t('about.values.trust.description')}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-comfortaa">{t('about.values.quality.title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 font-roboto">{t('about.values.quality.description')}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-comfortaa">{t('about.values.innovation.title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 font-roboto">{t('about.values.innovation.description')}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-comfortaa">{t('about.values.community.title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 font-roboto">{t('about.values.community.description')}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-comfortaa">{t('about.values.excellence.title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 font-roboto">{t('about.values.excellence.description')}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-comfortaa">{t('about.values.growth.title')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 font-roboto">{t('about.values.growth.description')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-comfortaa">
                {t('about.team.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-roboto">
                {t('about.team.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-24 h-24 bg-yp-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-lg font-comfortaa">{t('about.team.leadership.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-roboto">{t('about.team.leadership.description')}</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-lg font-comfortaa">{t('about.team.development.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-roboto">{t('about.team.development.description')}</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-lg font-comfortaa">{t('about.team.support.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-roboto">{t('about.team.support.description')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-comfortaa">
                {t('about.contact.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-roboto">
                {t('about.contact.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-yp-blue rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-comfortaa">{t('about.contact.phone.title')}</h3>
                <p className="text-gray-600 font-roboto">(+250) 791 568 519</p>
                <p className="text-sm text-gray-500 font-roboto">{t('about.contact.phone.hours')}</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-comfortaa">{t('about.contact.email.title')}</h3>
                <p className="text-gray-600 font-roboto">info@bara.com</p>
                <p className="text-sm text-gray-500 font-roboto">{t('about.contact.email.response')}</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-comfortaa">{t('about.contact.location.title')}</h3>
                <p className="text-gray-600 font-roboto">{t('about.contact.location.address')}</p>
                <p className="text-sm text-gray-500 font-roboto">{t('about.contact.location.visit')}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUsPage;
