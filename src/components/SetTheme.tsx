import { useTheme } from "next-themes";

const SetTheme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="mt-10 hover:bg-blue-400  p-3 px-6 pt-2 text-white bg-blue-500 rounded"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "Light Theme" : "Dark Theme"}
    </button>
  );
};

export default SetTheme;
