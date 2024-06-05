import React from 'react';
import { FC, useState } from 'react';
import { FiHome, FiMenu, FiUser, FiXSquare } from 'react-icons/fi';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { NavigationObject } from '../applications/utils';
import { create } from 'zustand';
import { Applications } from '../App';
import { TooltipProvider } from '@/components/ui/tooltip';

interface AuthStore {
  AUTH_EMAIL: string;
  AUTH_PASS: string;
  isAuthorised: boolean;
  setAuthorised: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>(set => {
  // Check if the user is already authenticated from localStorage
  const isAuthorised = sessionStorage.getItem('isAuthorised') === 'true';

  return {
    AUTH_EMAIL: import.meta.env.VITE_APP_AUTH_EMAIL,
    AUTH_PASS: import.meta.env.VITE_APP_AUTH_PASSWORD,
    isAuthorised,
    setAuthorised: value => {
      // Update the store
      set({ isAuthorised: value });
      // Update localStorage
      sessionStorage.setItem('isAuthorised', value ? 'true' : 'false');
    }
  };
});

interface FrameProps {
  navigation: NavigationObject[];
}

export const Frame: FC<FrameProps> = ({ navigation }) => {
  // State to manage the visibility of the navigation menu
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Function to toggle the visibility of the navigation menu
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNavMenu = () => {
    setIsNavOpen(false);
  };

  const handleHomeClick = () => {
    // return;
    // const name = "Tools For Charities";
    // const parts = name.split(" ");
    // const titleHeader = document.getElementById("title-header");
    // if (titleHeader) {
    //   titleHeader.innerHTML = parts.map((part, index) => (
    //     `<span class="${index % 2 === 0 ? 'font-semibold' : 'font-extralight px-0.5'}">${part}</span>`
    //   )).join("");
    // }
    // Close the navigation menu if needed
    closeNavMenu();
  };

  const location = useLocation();
  const current = Applications.find(app => {
    const routes = [...app.routes.dashboard, ...app.routes.standalone];
    return routes.some(route => location.pathname.endsWith(route.path));
  });
  const titleFragments = current?.name.split(' ').map((value, index) => (
    <span key={index} className={index % 2 === 0 ? 'font-semibold' : 'font-extralight px-0.5'}>
      {value}
    </span>
  ));

  const title = <React.Fragment>{titleFragments}</React.Fragment>;

  return (
    <TooltipProvider>
    <main className="w-screen min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#438959] fixed w-full z-10">
        <div className="w-full max-w-7xl mx-auto py-2 px-3 md:py-4 md:px-6 text-white flex justify-between items-center">
          <button className="md:hidden w-8 h-8" onClick={toggleNav}>
            {isNavOpen ? <FiXSquare className="w-full h-full" /> : <FiMenu className="w-full h-full" />}
          </button>
          <div className="hidden md:flex rounded-full w-8 h-8 md:w-12 md:h-12 overflow-hidden">
            <svg
              height="100%"
              style={{
                fill: 'white',
                fillRule: 'nonzero',
                clipRule: 'evenodd',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              }}
              version="1.1"
              viewBox="0 0 180 180"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs />
              <g id="Layer-1">
                <path
                  d="M19.8553 40.2667C19.8553 40.2667 23.146 35.6011 25.3565 33.6088L76.4372 87.1998C76.4372 87.1998 77.7936 94.5509 65.975 87.5021L19.8553 40.2667ZM11.1263 55.9405C11.1263 55.9405 12.3195 51.7918 14.8817 47.2902L51.3176 85.3208C51.3176 85.3208 54.7464 93.6179 42.9402 88.8261L11.1263 55.9405ZM5.56231 73.8587C5.56231 73.8587 6.45405 68.8276 7.92355 64.7797L28.2704 85.6864C28.2704 85.6864 30.7823 94.3366 20.9104 88.1959C20.9104 88.1959 19.1394 87.6663 17.9211 86.872C16.7028 86.0648 5.56231 73.8587 5.56231 73.8587Z"
                  opacity="0.5548"
                  stroke="none"
                />
                <path
                  d="M74.8544 5.40347C74.8544 5.40347 80.4434 4.36949 83.4075 4.49558L82.9553 78.7787C82.9553 78.7787 78.8357 84.9955 75.2439 71.6544L74.8544 5.40347ZM57.7478 10.523C57.7478 10.523 61.4784 8.39196 66.4267 6.96707L66.2382 59.8137C66.2382 59.8137 62.9602 68.174 57.8109 56.4472L57.7478 10.523ZM41.3449 19.4506C41.3449 19.4506 45.4645 16.4747 49.3203 14.5959L49.446 43.8754C49.446 43.8754 45.2636 51.8447 42.4376 40.5086C42.4376 40.5086 41.5333 38.8946 41.2193 37.4697C40.9053 36.0322 41.3449 19.4506 41.3449 19.4506Z"
                  opacity="0.8982"
                  stroke="none"
                />
                <path
                  d="M5.21069 106.192C5.21069 106.192 4.118 100.568 4.21847 97.5921L77.9692 97.2136C77.9692 97.2136 84.1864 101.286 70.986 105.07L5.21069 106.192ZM10.4732 123.353C10.4732 123.353 8.31294 119.621 6.84347 114.653L59.3181 114.249C59.3181 114.249 67.6453 117.465 56.065 122.773L10.4732 123.353ZM19.5414 139.771C19.5414 139.771 16.5396 135.66 14.6305 131.789L43.6938 131.335C43.6938 131.335 51.6569 135.458 40.4283 138.434C40.4283 138.434 38.8332 139.355 37.4139 139.695C36.0072 140.036 19.5414 139.771 19.5414 139.771Z"
                  opacity="0.7443"
                  stroke="none"
                />
                <path
                  d="M40.6677 162.152C40.6677 162.152 35.9703 158.924 33.9608 156.743L86.1592 104.261C86.1592 104.261 93.4314 102.76 86.674 114.79L40.6677 162.152ZM56.4052 170.638C56.4052 170.638 52.2602 169.516 47.7514 167.019L84.7903 129.594C84.7903 129.594 92.9539 125.975 88.4323 137.954L56.4052 170.638ZM74.3027 175.897C74.3027 175.897 69.2913 175.102 65.2473 173.702L85.5941 152.808C85.5941 152.808 94.1347 150.11 88.219 160.172C88.219 160.172 87.729 161.963 86.963 163.199C86.197 164.434 74.3027 175.897 74.3027 175.897Z"
                  opacity="0.3937"
                  stroke="none"
                />
                <path
                  d="M105.588 175.078C105.588 175.078 99.9993 176.163 97.0476 176.062L96.8716 101.779C96.8716 101.779 100.941 95.5246 104.646 108.84L105.588 175.078ZM122.657 169.808C122.657 169.808 118.939 171.976 114.003 173.439L113.752 120.592C113.752 120.592 116.955 112.207 122.205 123.883L122.657 169.808ZM138.972 160.729C138.972 160.729 134.878 163.743 131.034 165.659L130.658 136.392C130.658 136.392 134.765 128.385 137.691 139.696C137.691 139.696 138.608 141.31 138.935 142.735C139.286 144.147 138.972 160.729 138.972 160.729Z"
                  opacity="0.8982"
                  stroke="none"
                />
                <path
                  d="M138.984 19.1091C138.984 19.1091 143.669 22.3624 145.666 24.5565L93.1787 76.7601C93.1787 76.7601 85.9065 78.2232 92.7266 66.2314L138.984 19.1091ZM123.297 10.5472C123.297 10.5472 127.429 11.6947 131.938 14.2166L94.6859 51.4402C94.6859 51.4402 86.4969 55.0085 91.0936 43.0548L123.297 10.5472ZM105.424 5.18814C105.424 5.18814 110.423 6.00776 114.467 7.43265L94.0074 28.2133C94.0074 28.2133 85.4544 30.8613 91.4204 20.8367C91.4204 20.8367 91.9228 19.0461 92.6888 17.8103C93.4673 16.5872 105.424 5.18814 105.424 5.18814Z"
                  opacity="0.3959"
                  stroke="none"
                />
                <path
                  d="M174.906 74.7438C174.906 74.7438 175.923 80.3802 175.786 83.3562L102.035 82.7007C102.035 82.7007 95.8677 78.5395 109.131 74.9457L174.906 74.7438ZM169.87 57.4941C169.87 57.4941 171.98 61.2515 173.387 66.2448L120.912 65.9046C120.912 65.9046 112.622 62.5754 124.278 57.431L169.87 57.4941ZM161.04 40.9627C161.04 40.9627 163.992 45.1112 165.838 49.0076L136.775 49.0581C136.775 49.0581 128.875 44.8212 140.141 42.0093C140.141 42.0093 141.748 41.1014 143.168 40.7861C144.587 40.4709 161.04 40.9627 161.04 40.9627Z"
                  opacity="0.7398"
                  stroke="none"
                />
                <path
                  d="M160.626 139.799C160.626 139.799 157.386 144.502 155.188 146.507L103.542 93.471C103.542 93.471 102.11 86.1323 114.004 93.0552L160.626 139.799ZM169.192 124.024C169.192 124.024 168.036 128.186 165.524 132.712L128.687 95.0724C128.687 95.0724 125.17 86.8131 137.014 91.4792L169.192 124.024ZM174.567 106.056C174.567 106.056 173.726 111.087 172.307 115.16L151.734 94.4801C151.734 94.4801 149.134 85.8677 159.068 91.8949C159.068 91.8949 160.84 92.3993 162.07 93.194C163.289 93.9629 174.567 106.056 174.567 106.056Z"
                  opacity="0.552"
                  stroke="none"
                />
              </g>
            </svg>
          </div>
          <h1 className="text-2xl md:text-4xl" id="title-header">
            {title && title.props.children ? (
              title
            ) : (
              <React.Fragment>
                <span className="font-semibold">Tools</span>
                <span className="font-extralight px-0.5">For</span>
                <span className="font-semibold">Charities</span>
              </React.Fragment>
            )}
          </h1>
          <div className="w-8 h-8 md:w-12 md:h-12 overflow-hidden">
            <button className="rounded-full w-8 h-8 md:w-12 md:h-12 bg-white/25 overflow-hidden">
              {useAuthStore().isAuthorised ? (
                <img
                  className="h-full w-full"
                  src="https://media.licdn.com/dms/image/C5603AQHx1SXKVoQkBA/profile-displayphoto-shrink_400_400/0/1518451430090?e=2147483647&v=beta&t=4pZDaQ2S5Qbo5a0ksNrV983JNzS6eXrKTSZuUlSjjvE"
                />
              ) : (
                <FiUser className="w-full h-full " />
              )}
            </button>
          </div>
        </div>
      </header>
      <div>
        <div className="flex gap-6 w-full max-w-7xl mx-auto px-3 py-2 md:px-5 mt-12 md:mt-24">
          {isNavOpen && (
            //Overlay for Menu
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={closeNavMenu} // Close menu when overlay is clicked
            ></div>
          )}
          <nav
            className={`${isNavOpen ? 'block absolute z-30 shadow-md' : 'hidden'} w-fit h-fit md:flex gap-1 flex-col p-3 pl-1 bg-white border border-gray-100 rounded-lg`}
          >
            <span className="text-gray-500 px-4 py-2 font-medium">Navigation</span>
            <Link
              to="/"
              onClick={handleHomeClick}
              key="home"
              className="flex gap-2 items-center px-4 py-2 text-gray-700 font-medium hover:bg-gray-50"
            >
              <FiHome />
              <span>Home</span>
            </Link>
            {navigation.map(nav => (
              <NavigationSection key={nav.path} {...nav} onClick={closeNavMenu} />
            ))}
          </nav>
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
    </TooltipProvider>
  );
};

interface NavigationSectionProps extends NavigationObject {
  onClick?: () => void;
}

const NavigationSection: FC<NavigationSectionProps> = ({ icon: Icon, name, path, children, onClick }) => {
  const handleMenuItemClick = () => {
    //return;
    // if (path?.indexOf("breakout") === -1){
    //   const parts = name.split(" ");
    //   const titleHeader = document.getElementById("title-header");
    //   if (titleHeader) {
    //     titleHeader.innerHTML = parts.map((part, index) => (
    //       `<span class="${index % 2 === 0 ? 'font-semibold' : 'font-extralight px-0.5'}">${part}</span>`
    //     )).join("");
    //   }
    // }
    if (onClick) onClick();
  };

  return (
    <>
      <Link
        to={path}
        onClick={handleMenuItemClick}
        className="flex gap-2 items-center px-4 py-2 text-gray-700 font-medium hover:bg-gray-50"
      >
        <Icon />
        <span>{name}</span>
      </Link>
      {children && (
        <div className="ml-4 flex gap-1 flex-col">
          {children.map((child, index) => (
            <NavigationSection key={index} {...child} onClick={onClick} />
          ))}
        </div>
      )}
    </>
  );
};
