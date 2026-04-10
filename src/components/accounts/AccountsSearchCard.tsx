import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type AccountsSearchCardProps = {
  searchId: string;
  setSearchId: (value: string) => void;
  loading: boolean;
  onSearch: () => Promise<void>;
};

export function AccountsSearchCard({
  searchId,
  setSearchId,
  loading,
  onSearch,
}: AccountsSearchCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Available Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="Enter Account ID (e.g. ACC1001)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void onSearch()}
          />
          <Button
            onClick={() => void onSearch()}
            disabled={loading}
            variant="secondary"
          >
            <Search className="mr-1.5 h-4 w-4" />
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
