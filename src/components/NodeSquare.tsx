import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checkNodeStatus } from "../lib/checkNodeStatus";
import { Loader2, ExternalLink } from "lucide-react";
import { useState } from "react";

interface NodeSquareProps {
  nodeNumber: number;
}

export function NodeSquare({ nodeNumber }: NodeSquareProps) {
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);

  const nodeUrl = `https://cu${nodeNumber}.ao-testnet.xyz/`;

  const { data: isOnline, isFetching } = useQuery({
    queryKey: ["node", nodeNumber],
    queryFn: () => checkNodeStatus(nodeUrl),
    refetchInterval: 60000,
    retry: 1,
    retryDelay: 1000,
    staleTime: 30000,
  });

  const handleClick = () => {
    queryClient.invalidateQueries({ queryKey: ["node", nodeNumber] });
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(nodeUrl, "_blank");
  };

  const status = isFetching ? "loading" : isOnline ? "online" : "offline";

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative aspect-square rounded-md flex items-center justify-center cursor-pointer
        ${
          status === "loading"
            ? "bg-gray-500"
            : status === "online"
            ? "bg-green-500"
            : status === "offline"
            ? "bg-destructive"
            : "bg-muted"
        }
      `}
      title={`CU${nodeNumber} - ${
        status.charAt(0).toUpperCase() + status.slice(1)
      }`}
    >
      {isFetching ? (
        <Loader2 className="h-4 w-4 text-white animate-spin" />
      ) : (
        <span className="text-sm font-medium text-white">{nodeNumber}</span>
      )}
      {isHovered && !isFetching && (
        <div
          className="absolute top-1 right-1 p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
          onClick={handleExternalLink}
        >
          <ExternalLink className="h-3 w-3 text-white" />
        </div>
      )}
    </div>
  );
}