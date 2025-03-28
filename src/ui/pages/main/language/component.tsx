import i18n from "@/shared/locales/i18n";
import { useAppState } from "@/ui/states/appState";
import s from "./styles.module.scss";
import cn from "classnames";

const Language = () => {
  const { updateAppState } = useAppState((v) => ({
    updateAppState: v.updateAppState,
  }));

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    await updateAppState({ language: lng });
    window.location.reload();
  };

  const newLanguage = (lng: string) => {
    return async () => {
      await changeLanguage(lng);
    };
  };

  return (
    <div className={s.languages}>
      <div className="flex w-10/12 justify-evenly gap-4">
        <button
          className={cn(s.langBtn, "btn primary")}
          onClick={newLanguage("en")}
        >
          English
        </button>
        <button
          className={cn(s.langBtn, "btn primary")}
          onClick={newLanguage("ch")}
        >
          简体中文
        </button>
      </div>
      <div className="flex w-10/12 justify-evenly gap-4">
        <button
          className={cn(s.langBtn, "btn primary")}
          onClick={newLanguage("kr")}
        >
          한국인
        </button>
      </div>
    </div>
  );
};

export default Language;
