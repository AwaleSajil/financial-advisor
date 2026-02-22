import { Redirect } from "expo-router";
import { useAuth } from "../src/providers/AuthProvider";
import { LoadingSpinner } from "../src/components/LoadingSpinner";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Redirect href="/(tabs)/chat" />;
  }

  return <Redirect href="/login" />;
}
