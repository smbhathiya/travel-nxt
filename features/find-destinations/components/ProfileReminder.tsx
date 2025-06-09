import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProfileReminder({
  show,
  userProfile,
  user,
}: {
  show: boolean;
  userProfile: any;
  user: any;
}) {
  if (!show) return null;
  return (
    <div className="bg-muted-foreground/10 rounded-lg p-4 text-center">
      <p className="font-medium">
        Complete your profile for better recommendations
      </p>
      <p className="text-sm text-muted-foreground my-2">
        {!userProfile.interests?.length ? "Add your travel interests" : ""}
        {!userProfile.interests?.length &&
        !userProfile.previousDestinations?.length
          ? " and "
          : ""}
        {!userProfile.previousDestinations?.length
          ? "add your travel history"
          : ""}
        {" to get personalized suggestions."}
      </p>
      <div className="flex justify-center gap-3 mt-4">
        {!userProfile.interests?.length && (
          <Button size="sm" variant="outline" asChild>
            <Link href="/interests">Add Interests</Link>
          </Button>
        )}
        {!userProfile.previousDestinations?.length && (
          <Button size="sm" variant="outline" asChild>
            <Link href="/previous-trips">Add Travel History</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
