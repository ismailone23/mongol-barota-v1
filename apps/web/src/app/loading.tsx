import { LoadingSpinner } from "@workspace/ui/components/loading-spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner className="w-12 h-12 text-primary" />
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Loading MIST Mongol Barota
          </h2>
          <p className="text-muted-foreground">Preparing rover data...</p>
        </div>
      </div>
    </div>
  );
}
