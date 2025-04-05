
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wine } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="premium-card text-center max-w-md w-full py-10 px-6">
        <Wine size={60} className="mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">This page seems to have evaporated</p>
        <Button asChild className="w-full">
          <a href="/">Return to Pourfolio</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
