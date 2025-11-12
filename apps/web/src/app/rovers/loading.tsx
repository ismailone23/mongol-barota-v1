import { LoadingSpinner } from "@workspace/ui/components/loading-spinner";

export default function RoversLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner className="w-10 h-10 text-primary" />
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold">Loading Rovers</h2>
          <p className="text-sm text-muted-foreground">
            Fetching rover specifications...
          </p>
        </div>
      </div>
    </div>
  );
}
