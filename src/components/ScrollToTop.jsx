import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 🔥 HARD RESET (fixes browser scroll memory issue)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;