import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 text-gray-700">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Four Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          
          {/* About Column */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 pb-2 border-b-2 border-[#70905a] font-comfortaa">
              {t('footer.about')}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base">
                  {t('footer.contactUs')}
                </Link>
              </li>
              {/* <li>
                <Link to="/advertise" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto">
                  {t('footer.advertiseWithUs')}
                </Link>
              </li> 
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base">
                  {t('footer.corporateBlog')}
                </Link>
              </li>*/}
              <li>
                <Link to="/advertise" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base">
                  {t('footer.advertisingChoices')}
                </Link>
              </li>
              <li>
                <Link to="/ask-question" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base">
                  {t('footer.AskUsAnyQuestion')}
                </Link>
              </li>
              <li>
                <Link to="/claim-listing" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base">
                  {t('footer.ClaimYourListing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Site Directory Column */}
          {/* <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 pb-2 border-b-2 border-[#70905a] font-comfortaa">
              {t('footer.siteDirectory')}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link to="/articles" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base">
                  {t('footer.articles')}
                </Link>
              </li>
              <li>
                <Link to="/find-business" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base">
                  {t('footer.findBusiness')}
                </Link>
              </li>
              <li>
                <Link to="/mobile-app" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base">
                  {t('footer.ypMobileApp')}
                </Link>
              </li>
              <li>
                <Link to="/gas-guru" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base">
                  {t('footer.gasGuruMobileApp')}
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base">
                  {t('footer.siteMap')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base">
                  {t('footer.categories')}
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base">
                  {t('footer.browseRestaurants')}
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Cities Column */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 pb-2 border-b-2 border-[#70905a] font-comfortaa">
              {t('footer.cities')}
            </h3>
            <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
              <div>
                <Link 
                  to="#" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇷🇼</span>
                  {t('footer.kigaliRwanda')}
                </Link>
              </div>
              <div>
                <Link 
                  to="#" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇰🇪</span>
                  {t('footer.nairobiKenya')}
                </Link>
              </div>
              <div>
                <Link 
                  to="#" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇺🇬</span>
                  {t('footer.kampalaUganda')}
                </Link>
              </div>
              <div>
                <Link 
                  to="#" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇹🇿</span>
                  {t('footer.darEsSalaamTanzania')}
                </Link>
              </div>
              <div>
                <Link 
                  to="#" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇪🇹</span>
                  {t('footer.addisAbabaEthiopia')}
                </Link>
              </div>
              <div>
                <Link 
                  to="#" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇬🇭</span>
                  {t('footer.accraGhana')}
                </Link>
              </div>
              <div>
                <Link 
                  to="#" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇳🇬</span>
                  {t('footer.lagosNigeria')}
                </Link>
              </div>
              <div>
                <Link 
                  to="#" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇿🇦</span>
                  {t('footer.capeTownSouthAfrica')}
                </Link>
              </div>
            </div>
          </div>

          {/* Local Communities Column */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 pb-2 border-b-2 border-[#70905a] font-comfortaa">
              {t('footer.localCommunities')}
            </h3>
            <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
              <div>
                <Link 
                  to="https://afri-nexus-listings-xw16.vercel.app/" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇷🇼</span>
                  {t('footer.rwandafulRwanda')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/beautiful-botswana" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇧🇼</span>
                  {t('footer.beautifulBotswana')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/kenyaful-kenya" 
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇰🇪</span>
                  {t('footer.kenyafulKenya')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/ugandaful-uganda" 
                  className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇺🇬</span>
                  {t('footer.ugandafulUganda')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/tanzaniaful-tanzania" 
                  className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇹🇿</span>
                  {t('footer.tanzaniafulTanzania')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/ethiopiaful-ethiopia" 
                  className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇪🇹</span>
                  {t('footer.ethiopiafulEthiopia')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/ghanaful-ghana" 
                  className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇬🇭</span>
                  {t('footer.ghanafulGhana')}
                </Link>
              </div>
              <div>
                <Link 
                  to="/communities/nigeriaful-nigeria" 
                  className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base"
                >
                  <span className="mr-2">🇳🇬</span>
                  {t('footer.nigeriafulNigeria')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Communities Section */}
        {/* <div className="border-t border-gray-300 pt-6 sm:pt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-[#70905a] font-comfortaa text-center sm:text-left">
            {t('footer.communities')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
            
            <div>
              <Link 
                to="/communities/rwandaful-rwanda" 
                className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
              >
                <span className="mr-2">🇷🇼</span>
                {t('footer.rwandafulRwanda')}
              </Link>
            </div>
            <div>
              <Link 
                to="/communities/beautiful-botswana" 
                className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
              >
                <span className="mr-2">🇧🇼</span>
                {t('footer.beautifulBotswana')}
              </Link>
            </div>
            <div>
              <Link 
                to="/communities/kenyaful-kenya" 
                className="text-gray-600 hover:text-gray-800 transition-colors flex items-center font-roboto text-sm sm:text-base"
              >
                <span className="mr-2">🇰🇪</span>
                {t('footer.kenyafulKenya')}
              </Link>
            </div>
            <div>
              <Link 
                to="/communities/ugandaful-uganda" 
                className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base"
              >
                <span className="mr-2">🇺🇬</span>
                {t('footer.ugandafulUganda')}
              </Link>
            </div>
            <div>
              <Link 
                to="/communities/tanzaniaful-tanzania" 
                className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base"
              >
                <span className="mr-2">🇹🇿</span>
                {t('footer.tanzaniafulTanzania')}
              </Link>
            </div>
            <div>
              <Link 
                to="/communities/ethiopiaful-ethiopia" 
                className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base"
              >
                <span className="mr-2">🇪🇹</span>
                {t('footer.ethiopiafulEthiopia')}
              </Link>
            </div>
            <div>
              <Link 
                to="/communities/ghanaful-ghana" 
                className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base"
              >
                <span className="mr-2">🇬🇭</span>
                {t('footer.ghanafulGhana')}
              </Link>
            </div>
            <div>
              <Link 
                to="/communities/nigeriaful-nigeria" 
                className="text-gray-600 hover:text-gray-800 transition-colors font-roboto text-sm sm:text-base"
              >
                <span className="mr-2">🇳🇬</span>
                {t('footer.nigeriafulNigeria')}
              </Link>
            </div>
          </div>
        </div> */}

        {/* Legal Links */}
        {/* <div className="border-t border-gray-300 pt-6 pb-4">
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/privacy" className="text-[#e64600] hover:text-[#c93e00] transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="text-[#e64600] hover:text-[#c93e00] transition-colors">
              {t('footer.terms')}
            </Link>
            <Link to="/legal" className="text-[#e64600] hover:text-[#c93e00] transition-colors">
              {t('footer.legal')}
            </Link>
          </div>
        </div> */}

        {/* Copyright Information */}
        <div className="border-t border-gray-300 pt-3 sm:pt-4 md:pt-6">
          <div className="text-center text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-2">
            <p className="font-roboto">{t('footer.copyright')}</p>
            <p className="font-roboto">{t('footer.trademark')}</p>
            <p className="font-roboto">{t('footer.otherMarks')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;