import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Button } from "./components/ui/button";
import {
  ReloadIcon,
  GitHubLogoIcon,
  DiscordLogoIcon,
} from "@radix-ui/react-icons";
import { NodeSquare } from "./components/NodeSquare";
import { checkNodeStatus } from "./lib/checkNodeStatus";
import { useEffect } from "react";

const TOTAL_NODES = 150;
const nodes = Array.from({ length: TOTAL_NODES }, (_, i) => i + 1);

function App() {
  const queryClient = useQueryClient();

  const nodeQueries = useQueries({
    queries: nodes.map((nodeNumber) => ({
      queryKey: ["node", nodeNumber],
      queryFn: () => checkNodeStatus(`https://cu${nodeNumber}.ao-testnet.xyz/`),
      refetchInterval: 60000,
      retry: 1,
      retryDelay: 1000,
      staleTime: 30000,
    })),
  });

  const onlineNodesCount = nodeQueries.filter(
    (query) => !query.isLoading && query.data === true
  ).length;

  const allNodesOnline = onlineNodesCount === TOTAL_NODES;

  // Update favicon based on status
  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    console.log(favicon);
    if (favicon) {
      favicon.setAttribute(
        "href",
        allNodesOnline
          ? "./network-status-green.svg"
          : "./network-status-orange.svg"
      );
    }
  }, [allNodesOnline]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["node"] });
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">AO Testnet CU Node Status</h1>
            <p className="text-muted-foreground mt-1">
              {onlineNodesCount} / {TOTAL_NODES} online
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/basejump-xyz/ao-testnet-status"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-foreground/80 transition-colors"
            >
              <GitHubLogoIcon className="h-5 w-5" />
            </a>
            <a
              href="https://discord.gg/basejump"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-foreground/80 transition-colors"
            >
              <DiscordLogoIcon className="h-5 w-5" />
            </a>
            <Button variant="default" onClick={handleRefresh}>
              <span className="flex items-center gap-2">
                <ReloadIcon className="h-4 w-4" />
                Refresh All
              </span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2">
          {nodes.map((nodeNumber, index) => (
            <NodeSquare
              key={nodeNumber}
              nodeNumber={nodeNumber}
              queryData={nodeQueries[index]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
