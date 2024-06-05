import { FiFacebook, FiInstagram, FiLinkedin, FiMonitor, FiTwitter } from 'react-icons/fi';
import { SiThreads} from 'react-icons/si';
import { RiTiktokLine} from 'react-icons/ri';

import { IconType } from 'react-icons';

interface SocialMediaCompany {
  description: string;
  icon: IconType;
}

interface SocialMediaCompanies {
  [key: string]: SocialMediaCompany;
}

const SocialMediaCompanies: SocialMediaCompanies = {
  website: {
    description: 'Your website',
    icon: FiMonitor
  },
  facebook: {
    description: 'Facebook',
    icon: FiFacebook
  },
  instagram: {
    description: 'Instagram',
    icon: FiInstagram
  },
  linkedIn: {
    description: 'LinkedIn',
    icon: FiLinkedin
  },
  threads: {
    description: 'Threads',
    icon: SiThreads
  },
  tiktok: {
    description: 'Tiktok',
    icon: RiTiktokLine
  },
  twitter: {
    description: 'Twitter (X)',
    icon: FiTwitter
  }
};

export default SocialMediaCompanies;
