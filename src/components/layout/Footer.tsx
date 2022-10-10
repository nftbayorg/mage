import Link from "next/link";

const Footer = () => (
  <div className="relative container mx-auto p-6 border-t border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
    <div className="flex-col justify-between">
      <div className="flex justify-between">
        <Link href="/" passHref>
          <div className="flex items-center">
            <span className="text-4xl font-medium">
              Mage
            </span>
          </div>
        </Link>
        <ul className="mx-auto">
          <li>
            <Link href="#how-to">
              <a className="hover:text-blue-500">
                Marketplace
              </a>
            </Link>
          </li>
          <li>
            <Link href="#fees">
              <a className="hover:text-blue-500">
                Staking
              </a>
            </Link>
          </li>
          <li>Contact Us</li>
        </ul>
      </div>
      <div className="mt-20">
        <span>
          All right reserved
        </span>
        <div>© Mage.com</div>
      </div>
    </div>
  </div>
);

export default Footer;
