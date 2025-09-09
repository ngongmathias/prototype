import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Building, 
  Target, 
  Users, 
  TrendingUp, 
  Globe, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  Star,
  ArrowRight,
  BarChart3,
  Megaphone,
  Eye,
  MousePointer
} from "lucide-react";

const AdvertisePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-yp-blue to-blue-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-comfortaa">
              {t('advertise.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-roboto">
              {t('advertise.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-yp-blue hover:bg-gray-100 font-roboto">
                {t('advertise.hero.getStarted')}
              </Button>
              <Button size="lg" className="bg-white text-yp-blue hover:bg-gray-100 font-roboto">
                {t('advertise.hero.learnMore')}
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="text-4xl font-bold text-yp-blue">100K+</div>
                <p className="text-gray-600 font-roboto">{t('advertise.stats.monthlyVisitors')}</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-yp-blue">1K+</div>
                <p className="text-gray-600 font-roboto">{t('advertise.stats.businesses')}</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-yp-blue">95%</div>
                <p className="text-gray-600 font-roboto">{t('advertise.stats.satisfaction')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-comfortaa">
                {t('advertise.services.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-roboto">
                {t('advertise.services.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Premium Listing */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-yp-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-comfortaa">{t('advertise.services.premium.title')}</CardTitle>
                  <CardDescription className="font-roboto">
                    {t('advertise.services.premium.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {t('advertise.services.premium.feature1')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {t('advertise.services.premium.feature2')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {t('advertise.services.premium.feature3')}
                    </li>
                  </ul>
                  <Button className="w-full bg-yp-blue hover:bg-yp-blue/90 font-roboto">
                    {t('advertise.services.premium.cta')}
                  </Button>
                </CardContent>
              </Card>

              {/* Targeted Advertising */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-comfortaa">{t('advertise.services.targeted.title')}</CardTitle>
                  <CardDescription className="font-roboto">
                    {t('advertise.services.targeted.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {t('advertise.services.targeted.feature1')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {t('advertise.services.targeted.feature2')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {t('advertise.services.targeted.feature3')}
                    </li>
                  </ul>
                  <Button className="w-full bg-green-600 hover:bg-green-700 font-roboto">
                    {t('advertise.services.targeted.cta')}
                  </Button>
                </CardContent>
              </Card>

              {/* Analytics & Insights */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-comfortaa">{t('advertise.services.analytics.title')}</CardTitle>
                  <CardDescription className="font-roboto">
                    {t('advertise.services.analytics.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {t('advertise.services.analytics.feature1')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {t('advertise.services.analytics.feature2')}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {t('advertise.services.analytics.feature3')}
                    </li>
                  </ul>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 font-roboto">
                    {t('advertise.services.analytics.cta')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-comfortaa">
                {t('advertise.whyChoose.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-roboto">
                {t('advertise.whyChoose.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-yp-blue rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-comfortaa">{t('advertise.whyChoose.reach.title')}</h3>
                <p className="text-gray-600 text-sm font-roboto">{t('advertise.whyChoose.reach.description')}</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-comfortaa">{t('advertise.whyChoose.growth.title')}</h3>
                <p className="text-gray-600 text-sm font-roboto">{t('advertise.whyChoose.growth.description')}</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-comfortaa">{t('advertise.whyChoose.local.title')}</h3>
                <p className="text-gray-600 text-sm font-roboto">{t('advertise.whyChoose.local.description')}</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-comfortaa">{t('advertise.whyChoose.visibility.title')}</h3>
                <p className="text-gray-600 text-sm font-roboto">{t('advertise.whyChoose.visibility.description')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-yp-blue text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-comfortaa">
              {t('advertise.cta.title')}
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto font-roboto">
              {t('advertise.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-yp-blue hover:bg-gray-100 font-roboto">
                {t('advertise.cta.primaryButton')}
              </Button>
              <Button size="lg" className="bg-white text-yp-blue hover:bg-gray-100 font-roboto">
                {t('advertise.cta.secondaryButton')}
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-comfortaa">
                {t('advertise.contact.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-roboto">
                {t('advertise.contact.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-yp-blue rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-comfortaa">{t('advertise.contact.phone.title')}</h3>
                <p className="text-gray-600 font-roboto">(+250) 791 568 519</p>
                <p className="text-sm text-gray-500 font-roboto">{t('advertise.contact.phone.hours')}</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-comfortaa">{t('advertise.contact.email.title')}</h3>
                <p className="text-gray-600 font-roboto">advertise@bara.com</p>
                <p className="text-sm text-gray-500 font-roboto">{t('advertise.contact.email.response')}</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold font-comfortaa">{t('advertise.contact.location.title')}</h3>
                <p className="text-gray-600 font-roboto">{t('advertise.contact.location.address')}</p>
                <p className="text-sm text-gray-500 font-roboto">{t('advertise.contact.location.visit')}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AdvertisePage;
