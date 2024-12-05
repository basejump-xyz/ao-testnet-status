import { useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { checkNodeStatus } from "./checkNodeStatus";

const TOTAL_NODES = 150;
const nodes = Array.from({ length: TOTAL_NODES }, (_, i) => i + 1);

export const useOverallStatus = () => {
  const nodeQueries = useQueries({
    queries: nodes.map((nodeNumber) => ({
      queryKey: ["node-status", nodeNumber], // Different queryKey to not interfere with individual queries
      queryFn: () => checkNodeStatus(`https://cu${nodeNumber}.ao-testnet.xyz/`),
      refetchInterval: 60000,
      retry: 1,
      retryDelay: 1000,
      staleTime: 30000,
    })),
  });

  const allNodesOnline = nodeQueries.every(
    (query) => !query.isLoading && query.data === true
  );

  // Update favicon based on status
  const updateFavicon = () => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.setAttribute(
        "href",
        allNodesOnline
          ? "/network-status-green.svg"
          : "/network-status-orange.svg"
      );
    }
  };

  // Update favicon whenever status changes
  useEffect(() => {
    updateFavicon();
  }, [allNodesOnline]);

  return {
    allNodesOnline,
    isLoading: nodeQueries.some((query) => query.isLoading),
  };
};
