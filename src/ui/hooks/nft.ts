/* eslint-disable @typescript-eslint/no-floating-promises */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getDob0Imgs, getExtraDetailSpore, getURLFromHex } from "../utils/dob";
import {
  useGetCurrentAccount,
  useGetCurrentNetwork,
} from "../states/walletState";
import { isCkbNetwork } from "@/shared/networks";
import { INFT } from "@/shared/interfaces/nft";
import { ckbExplorerApi } from "../utils/helpers";

export const useGetMyNFTs = (isProgess?: boolean) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [nfts, setNFTs] = useState<INFT[]>([]);
  const [dob0Ids, setDob0Ids] = useState<string[]>([]);

  const currentAccount = useGetCurrentAccount();
  const currentNetwork = useGetCurrentNetwork();

  const isNext = useMemo(() => {
    return page < totalPage;
  }, [page, totalPage]);

  const isPrev = useMemo(() => {
    return page > 1;
  }, [page]);

  const getMyNFTs = useCallback(
    async (isLoading: boolean) => {
      if (!isCkbNetwork(currentNetwork.network)) {
        setIsLoading(false);
        return;
      }
      setIsLoading(isLoading);
      try {
        const res = await fetch(
          `${ckbExplorerApi(
            currentNetwork.slug
          )}/v2/nft/items?page=${page}&owner=${
            currentAccount.accounts[0].address
          }&standard=spore`,
          {
            method: "GET",
            headers: {
              Accept: "application/vnd.api+json",
            },
          }
        );
        const data = await res.json();
        setTotalPage(data.pagination.pages);
        const _nfts = [];
        for (let index = 0; index < data.data.length; index++) {
          const { url: imageUrl, contentType } = getURLFromHex(
            data.data[index].cell.data
          );

          const nftId = data.data[index].type_script.args;

          if (contentType === "dob/0") {
            if (!dob0Ids.includes(nftId)) {
              setDob0Ids((prev) => [...prev, nftId]);
            }
          }

          _nfts.push({
            ...data.data[index],
            imageUrl,
            contentType,
            loading: contentType === "dob/0",
          });
        }
        setNFTs(_nfts);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    if (nfts.length === 0 && !isLoading && isProgess) {
      getMyNFTs(true);
    }
  }, [getMyNFTs, nfts, isLoading, isProgess]);

  useEffect(() => {
    const _nfts = nfts;
    if (dob0Ids.length > 0 && _nfts.length > 0 && !isLoading) {
      getDob0Imgs(dob0Ids).then((res) => {
        Object.keys(res).forEach((id) => {
          const idx = nfts.findIndex((nft) => nft.type_script.args === id);
          if (idx > -1) {
            _nfts[idx] = {
              ...nfts[idx],
              imageUrl: res[id].url,
              contentType: res[id].contentType,
              loading: false,
            };
          }
        });
        setNFTs(_nfts);
      });
    }
  }, [nfts, dob0Ids, isLoading]);

  return {
    nfts,
    isLoading,
    isNext,
    isPrev,
    setPage,
    page,
  };
};

export const useGetDetailNFT = (isLoadNFT: boolean) => {
  const { collection, nftId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detailNFT, setDetailNFT] = useState<INFT | undefined>(undefined);

  const currentNetwork = useGetCurrentNetwork();

  const getDetailNFT = async () => {
    try {
      const res = await fetch(
        `${ckbExplorerApi(
          currentNetwork.slug
        )}/v2/nft/collections/${collection}/items/${nftId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.api+json",
          },
        }
      );
      const data = await res.json();
      const {
        url: imageUrl,
        capacity,
        contentType,
      } = await getExtraDetailSpore(
        data.cell.tx_hash,
        data.cell.cell_index,
        currentNetwork
      );
      setDetailNFT({
        ...data,
        imageUrl,
        capacity,
        contentType,
        loading: contentType === "dob/0",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoadNFT) {
      getDetailNFT();
    }
  }, [collection, nftId, isLoadNFT]);

  useEffect(() => {
    if (detailNFT?.loading && detailNFT.contentType === "dob/0") {
      getDob0Imgs([detailNFT.type_script.args]).then((res) => {
        const updatedDetailNFT = { ...detailNFT };
        if (res[detailNFT.type_script.args]) {
          updatedDetailNFT.imageUrl = res[detailNFT.type_script.args].url;
          updatedDetailNFT.contentType =
            res[detailNFT.type_script.args].contentType;
        }
        setDetailNFT({
          ...updatedDetailNFT,
          loading: false,
        });
      });
    }
  }, [detailNFT]);

  return {
    detailNFT,
    isLoading,
  };
};
