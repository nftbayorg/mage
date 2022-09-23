import Link from "next/link";

const Footer = () => (
  <div className="relative container mx-auto p-6 border-t border-gray-200 dark:border-gray-600">
    <div className="flex-col justify-between">
      <div className="flex justify-between">
        <Link href="/" passHref>
          <div className="flex items-center">
            <span className="text-4xl text-gray-700 font-medium dark:text-gray-300">
              Mage
            </span>
          </div>
        </Link>
        <ul className="mx-auto">
          <li>
            <Link href="#how-to">
              <a className="dark:text-gray-300 hover:text-blue-500 text-gray-700">
                Marketplace
              </a>
            </Link>
          </li>
          <li>
            <Link href="#fees">
              <a className="dark:text-gray-300 hover:text-blue-500 text-gray-700">
                Staking
              </a>
            </Link>
          </li>
          <li className="dark:text-gray-300 text-gray-700">Contact Us</li>
        </ul>
      </div>
      <div className="mt-20">
        <span className="dark:text-gray-300 text-gray-700">
          All right reserved
        </span>
        <div className="dark:text-gray-300 text-gray-700">© Mage.com</div>
      </div>
    </div>
  </div>
);

export default Footer;
