import { browserTabsCreate } from "@/shared/utils/browser";
import { isCkbNetwork } from "@/shared/networks";
import { useGetCurrentNetwork } from "@/ui/states/walletState";
import { t } from "i18next";
import { Link, useParams } from "react-router-dom";
import s from "./styles.module.scss";

const FinalleSend = () => {
  const { txId } = useParams();
  const currentNetwork = useGetCurrentNetwork();

  const onClick = async () => {
    await browserTabsCreate({
      active: true,
      url: `${currentNetwork.explorerUrl}/${
        isCkbNetwork(currentNetwork.network) ? "transaction" : "tx"
      }/${txId}`,
    });
  };

  return (
    <div className={s.container}>
      <div className={s.resultContainer}>
        <svg
          width="53"
          height="51"
          viewBox="0 0 53 51"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_3327_43445"
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="53"
            height="51"
          >
            <path
              d="M26.4996 50C29.7527 50.0041 32.9745 49.3723 35.98 48.1408C38.9854 46.9093 41.7152 45.1024 44.0124 42.8239C46.3157 40.5515 48.1423 37.8511 49.3873 34.8781C50.6322 31.9051 51.2709 28.718 51.2667 25.5C51.2709 22.282 50.6321 19.0949 49.3872 16.1219C48.1423 13.1489 46.3157 10.4486 44.0124 8.17606C41.7152 5.8976 38.9854 4.09069 35.98 2.85918C32.9745 1.62768 29.7527 0.995851 26.4996 1.00002C23.2465 0.995918 20.0247 1.62777 17.0192 2.85928C14.0138 4.09078 11.284 5.89765 8.98674 8.17606C6.68348 10.4486 4.85691 13.1489 3.61197 16.1219C2.36704 19.0949 1.7283 22.282 1.73244 25.5C1.72823 28.718 2.36694 31.9051 3.61188 34.8781C4.85682 37.8511 6.68343 40.5515 8.98674 42.8239C11.284 45.1023 14.0138 46.9092 17.0192 48.1407C20.0247 49.3722 23.2465 50.0041 26.4996 50Z"
              fill="white"
              stroke="white"
              strokeWidth="1.69832"
              strokeLinejoin="round"
            />
            <path
              d="M16.5928 25.4998L24.0229 32.8498L38.8832 18.1498"
              stroke="black"
              strokeWidth="1.69832"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
          <g mask="url(#mask0_3327_43445)">
            <path
              d="M-3.2207 -3.90018H56.2204V54.8998H-3.2207V-3.90018Z"
              fill="#0D0D0D"
            />
          </g>
        </svg>
        <h3 className={s.result}>
          {t("send.finalle_send.transaction_completed")}
        </h3>
      </div>

      <div className={s.btnContainer}>
        <Link
          to={"/home"}
          className="btn primary flex-3 !bg-transparent !text-primary"
        >
          {t("send.finalle_send.back")}
        </Link>
        <button className="btn primary flex-3" onClick={onClick}>
          {t("send.finalle_send.explorer")}
        </button>
      </div>
    </div>
  );
};

export default FinalleSend;
