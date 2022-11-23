import Link from "next/link";

const Footer = () => (
  <div className="relative container mx-auto p-6 border-t border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
    <div className="flex-col justify-between">
      <div className="flex justify-between">
        <Link href="/" passHref>
          <div className="flex items-center">
            <span className="text-5xl font-silkscreen">
              Mage
            </span>
          </div>
        </Link>
        <ul className="mx-auto">
          <li>
            <Link href="/trade">
              <a className="hover:text-blue-500 dark:hover:text-gray-500">
                Marketplace
              </a>
            </Link>
          </li>
          <li>
            <Link href="#fees">
              <a className="hover:text-blue-500 dark:hover:text-gray-500">
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
        <div className="font-silkscreen">© Mage.com</div>
      </div>
    </div>
  </div>
);

export default Footer;
