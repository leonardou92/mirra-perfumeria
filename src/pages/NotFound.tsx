import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">404 - No encontrado</h1>
      <div className="text-muted-foreground">La página que buscas no existe.</div>
    </div>
  );
};

export default NotFound;
