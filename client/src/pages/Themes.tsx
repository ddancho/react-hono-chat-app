import { useThemeContext } from "../context/ThemeContext";
import { DaisyUiThemes, themes } from "../types";

function ThemesPage() {
  const { currentTheme, setCurrentTheme } = useThemeContext();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl font-semibold">Themes</h1>
        </div>
        <span className="flex my-8 font-bold">
          Current theme is : {currentTheme}
        </span>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {themes.map((t) => (
            <button
              key={t}
              className={`
                flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${currentTheme === t ? "bg-base-100" : "hover:bg-base-300"}
              `}
              onClick={() => {
                setCurrentTheme(t as DaisyUiThemes);
              }}
            >
              <div
                className="relative h-8 w-full rounded-md overflow-hidden"
                data-theme={t}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThemesPage;
