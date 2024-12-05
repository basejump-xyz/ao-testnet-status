import { useQueryClient } from "@tanstack/react-query";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { NodeSquare } from "./components/NodeSquare";

const TOTAL_NODES = 150;
const nodes = Array.from({ length: TOTAL_NODES }, (_, i) => i + 1);

function App() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    nodes.forEach((node) => {
      queryClient.invalidateQueries({ queryKey: ["node", node] });
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">AO Testnet CU Node Status</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Click on individual nodes to refresh their status
            </p>
          </div>
          <Button variant="default" onClick={handleRefresh}>
            <span className="flex items-center gap-2">
              <ReloadIcon className="h-4 w-4" />
              Refresh All
            </span>
          </Button>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2">
          {nodes.map((nodeNumber) => (
            <NodeSquare key={nodeNumber} nodeNumber={nodeNumber} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
