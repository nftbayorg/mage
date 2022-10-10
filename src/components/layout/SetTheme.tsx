import { useTheme } from "next-themes";
import { FaRegMoon } from "react-icons/fa";
import { NavMenuItem } from "./NavMenu";

const SetTheme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {theme === "dark" ? 
        <NavMenuItem
          icon={<FaRegMoon size={20} className="fill-gray-700 dark:fill-gray-300"/>}
          caption="Use Light Theme"
          onClick={() => setTheme("light")}
        />
       : 
        <NavMenuItem
          icon={<FaRegMoon size={20} className="fill-gray-700 dark:fill-gray-300"/>}
          caption="Use Dark Theme"
          onClick={() => setTheme("dark")}
        />
      }
    </>
  );
};

export default SetTheme;
