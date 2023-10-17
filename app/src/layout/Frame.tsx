import { FC } from 'react';
import { FiHome } from 'react-icons/fi';
import { Link, Outlet } from 'react-router-dom';
import { NavigationObject } from '../applications/utils';

interface FrameProps {
  navigation: NavigationObject[];
}

export const Frame: FC<FrameProps> = ({ navigation }) => {
  return (
    <main className="w-screen min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#438959]">
        <div className="w-full max-w-7xl mx-auto py-4 px-6 text-white flex justify-between items-center">
          <svg width="209" height="40" viewBox="0 0 209 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_1409_969)">
              <rect x="17.1283" y="1.19922" width="2.21898" height="15.5329" rx="1.10949" fill="white" />
              <rect
                x="23.7862"
                y="36.7021"
                width="2.21898"
                height="15.5329"
                rx="1.10949"
                transform="rotate(-180 23.7862 36.7021)"
                fill="white"
              />
              <rect
                x="2.80671"
                y="22.3799"
                width="2.21898"
                height="15.5329"
                rx="1.10949"
                transform="rotate(-90 2.80671 22.3799)"
                fill="white"
              />
              <rect
                x="38.3106"
                y="15.7236"
                width="2.21898"
                height="15.5329"
                rx="1.10949"
                transform="rotate(90 38.3106 15.7236)"
                fill="white"
              />
              <rect x="13.9015" y="2.20801" width="2.21898" height="11.0949" rx="1.10949" fill="white" />
              <rect
                x="27.0138"
                y="35.6943"
                width="2.21898"
                height="11.0949"
                rx="1.10949"
                transform="rotate(-180 27.0138 35.6943)"
                fill="white"
              />
              <rect
                x="3.81519"
                y="25.6084"
                width="2.21898"
                height="11.0949"
                rx="1.10949"
                transform="rotate(-90 3.81519 25.6084)"
                fill="white"
              />
              <rect
                x="37.3019"
                y="12.4961"
                width="2.21898"
                height="11.0949"
                rx="1.10949"
                transform="rotate(90 37.3019 12.4961)"
                fill="white"
              />
              <rect x="10.4724" y="3.2168" width="2.21898" height="7.0604" rx="1.10949" fill="white" />
              <rect
                x="30.4428"
                y="34.6855"
                width="2.21898"
                height="7.0604"
                rx="1.10949"
                transform="rotate(-180 30.4428 34.6855)"
                fill="white"
              />
              <rect
                x="4.82475"
                y="29.0371"
                width="2.21898"
                height="7.0604"
                rx="1.10949"
                transform="rotate(-90 4.82475 29.0371)"
                fill="white"
              />
              <rect
                x="36.2932"
                y="9.06641"
                width="2.21898"
                height="7.0604"
                rx="1.10949"
                transform="rotate(90 36.2932 9.06641)"
                fill="white"
              />
              <g opacity="0.5">
                <rect
                  x="30.8777"
                  y="3.875"
                  width="2.21898"
                  height="15.5329"
                  rx="1.10949"
                  transform="rotate(45 30.8777 3.875)"
                  fill="white"
                />
                <rect
                  x="5.28084"
                  y="8.41602"
                  width="2.21898"
                  height="15.5329"
                  rx="1.10949"
                  transform="rotate(-45 5.28084 8.41602)"
                  fill="white"
                />
                <rect
                  x="35.5319"
                  y="29.4717"
                  width="2.21898"
                  height="15.5329"
                  rx="1.10949"
                  transform="rotate(135 35.5319 29.4717)"
                  fill="white"
                />
                <rect
                  x="10.2255"
                  y="34.126"
                  width="2.21898"
                  height="15.5329"
                  rx="1.10949"
                  transform="rotate(-135 10.2255 34.126)"
                  fill="white"
                />
                <rect
                  x="27.8821"
                  y="2.30566"
                  width="2.21898"
                  height="11.0949"
                  rx="1.10949"
                  transform="rotate(45 27.8821 2.30566)"
                  fill="white"
                />
                <rect
                  x="3.71175"
                  y="11.4121"
                  width="2.21898"
                  height="11.0949"
                  rx="1.10949"
                  transform="rotate(-45 3.71175 11.4121)"
                  fill="white"
                />
                <rect
                  x="37.1007"
                  y="26.4756"
                  width="2.21898"
                  height="11.0949"
                  rx="1.10949"
                  transform="rotate(135 37.1007 26.4756)"
                  fill="white"
                />
                <rect
                  x="13.2221"
                  y="35.6953"
                  width="2.21898"
                  height="11.0949"
                  rx="1.10949"
                  transform="rotate(-135 13.2221 35.6953)"
                  fill="white"
                />
                <rect
                  x="24.7433"
                  y="0.59375"
                  width="2.21898"
                  height="7.0604"
                  rx="1.10949"
                  transform="rotate(45 24.7433 0.59375)"
                  fill="white"
                />
                <rect
                  x="1.99995"
                  y="14.5498"
                  width="2.21898"
                  height="7.0604"
                  rx="1.10949"
                  transform="rotate(-45 1.99995 14.5498)"
                  fill="white"
                />
                <rect
                  x="38.8121"
                  y="23.3379"
                  width="2.21898"
                  height="7.0604"
                  rx="1.10949"
                  transform="rotate(135 38.8121 23.3379)"
                  fill="white"
                />
                <rect
                  x="16.3595"
                  y="37.4072"
                  width="2.21898"
                  height="7.0604"
                  rx="1.10949"
                  transform="rotate(-135 16.3595 37.4072)"
                  fill="white"
                />
              </g>
              <path
                d="M62.4251 34.3002C70.7703 34.3002 77.8064 27.3458 77.8064 19.0007H62.4251V23.2551H72.1611C70.6067 27.1822 66.925 29.9639 62.4251 29.9639C56.3708 29.9639 51.8709 25.055 51.8709 19.0007C51.8709 12.9463 56.3708 8.03739 62.4251 8.03739C65.5341 8.03739 68.1522 9.26462 70.0339 11.31L73.3066 8.03739C70.6067 5.4193 66.925 3.70117 62.4251 3.70117C53.9981 3.70117 46.962 10.5737 46.962 19.0007C46.962 28.0822 53.3436 34.3002 62.4251 34.3002Z"
                fill="white"
              />
              <path
                d="M88.0839 34.3002C92.9928 34.3002 97.2472 30.2912 97.2472 25.3823C97.2472 20.0643 93.4019 16.4644 88.0839 16.4644C83.175 16.4644 78.9206 20.4733 78.9206 25.3823C78.9206 30.7003 82.7659 34.3002 88.0839 34.3002ZM88.0839 30.0458C85.4658 30.0458 83.5023 28.0004 83.5023 25.3823C83.5023 22.6824 85.4658 20.7188 88.0839 20.7188C90.7838 20.7188 92.6656 22.6824 92.6656 25.3823C92.6656 28.0004 90.7838 30.0458 88.0839 30.0458Z"
                fill="white"
              />
              <path
                d="M107.626 34.3002C112.535 34.3002 116.789 30.2912 116.789 25.3823C116.789 20.0643 112.944 16.4644 107.626 16.4644C102.717 16.4644 98.4627 20.4733 98.4627 25.3823C98.4627 30.7003 102.308 34.3002 107.626 34.3002ZM107.626 30.0458C105.008 30.0458 103.044 28.0004 103.044 25.3823C103.044 22.6824 105.008 20.7188 107.626 20.7188C110.326 20.7188 112.208 22.6824 112.208 25.3823C112.208 28.0004 110.326 30.0458 107.626 30.0458Z"
                fill="white"
              />
              <path
                d="M127.168 34.3002C132.077 34.3002 136.332 30.2912 136.332 25.3823V4.11025H131.75V17.9371C130.277 16.8735 128.641 16.4644 126.923 16.4644C122.096 16.4644 118.005 20.4733 118.005 25.3823C118.005 30.7003 121.85 34.3002 127.168 34.3002ZM127.168 30.0458C124.55 30.0458 122.587 28.0004 122.587 25.3823C122.587 22.6824 124.55 20.7188 127.168 20.7188C129.868 20.7188 131.75 22.6824 131.75 25.3823C131.75 28.0004 129.868 30.0458 127.168 30.0458Z"
                fill="white"
              />
              <path
                d="M139.807 33.8911H144.634V21.1279H161.079V33.8911H165.906V4.11025H161.079V16.8735H144.634V4.11025H139.807V33.8911Z"
                fill="white"
              />
              <path
                d="M176.814 34.3002C181.477 34.3002 186.059 30.7003 186.059 25.3823V16.8735H181.477V25.3823C181.477 28.0004 179.595 30.0458 176.896 30.0458C174.277 30.0458 172.314 28.0004 172.314 25.3823V16.8735H167.732V25.3823C167.732 30.7003 171.496 34.3002 176.814 34.3002Z"
                fill="white"
              />
              <path
                d="M196.875 34.3002C201.784 34.3002 206.038 30.2912 206.038 25.3823C206.038 20.0643 202.438 16.4644 197.284 16.4644C195.156 16.4644 193.275 17.2007 192.293 18.3461V4.11025H187.711V25.3823C187.711 30.7003 191.557 34.3002 196.875 34.3002ZM196.875 30.0458C194.257 30.0458 192.293 28.0004 192.293 25.3823C192.293 22.6824 194.257 20.7188 196.875 20.7188C199.575 20.7188 201.456 22.6824 201.456 25.3823C201.456 28.0004 199.575 30.0458 196.875 30.0458Z"
                fill="white"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_1409_969"
                x="0.459518"
                y="0.0537109"
                width="207.578"
                height="39.8936"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="1" />
                <feGaussianBlur stdDeviation="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1409_969" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1409_969" result="shape" />
              </filter>
            </defs>
          </svg>
          <div className="rounded-full w-12 h-12 bg-white"></div>
        </div>
      </header>
      <div>
        <div className="flex gap-6 w-full max-w-7xl mx-auto py-8 px-5">
          <nav className="w-fit h-fit flex gap-1 flex-col py-3 px-3 bg-white border border-gray-100 rounded-lg">
            <label className="text-gray-500 text-sm px-4 py-2 font-medium">Navigation</label>
            <Link to="/" className="flex gap-2 items-center px-4 py-2 text-gray-700 font-medium hover:bg-gray-50">
              <FiHome />
              <span>Home</span>
            </Link>
            {navigation.map(NavigationSection)}
          </nav>
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};

const NavigationSection: FC<NavigationObject> = ({ icon: Icon, name, path, children }) => {
  return (
    <>
      {' '}
      <Link to={path} className="flex gap-2 items-center px-4 py-2 text-gray-700 font-medium hover:bg-gray-50">
        <Icon />
        <span>{name}</span>
      </Link>
      {children && <div className="ml-4 flex gap-1 flex-col">{children.map(NavigationSection)}</div>}
    </>
  );
};
