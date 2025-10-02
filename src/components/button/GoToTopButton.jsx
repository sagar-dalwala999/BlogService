import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const GoToTopButton = ({
  threshold = 150,
  position = "right",
  bottomOffset = 24,
  buttonColor = "bg-main",
  // hoverColor = "bg-primary-foreground",
  iconSize = 24,
  selectedDocketIds = []
}) => {
  const { scrollToTop, contentScrollRef } = useOutletContext() || {};
  const [isVisible, setIsVisible] = useState(false);
  const [currentBottomOffset, setCurrentBottomOffset] = useState(bottomOffset);

  useEffect(() => {
    if (!contentScrollRef?.current) return;

    const handleScroll = () => {
      const scrollTop = contentScrollRef.current.scrollTop;
      setIsVisible(scrollTop > threshold);
    };

    const scrollContainer = contentScrollRef.current;
    scrollContainer.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [contentScrollRef, threshold]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 374 && selectedDocketIds.length > 0) {
        setCurrentBottomOffset(95);
      } else {
        setCurrentBottomOffset(bottomOffset);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [bottomOffset, selectedDocketIds]);

  const positionClass = position === "left" ? "left" : "right-8";

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className={`fixed ${positionClass} z-50`}
      style={{ bottom: `${currentBottomOffset}px` }}
    >
      <div className="relative">
        {/* Gradient Glow Effect */}
        {/* <div className="absolute inset-0 rounded-full bg-gradient-to-t from-main via-main to-main opacity-70 blur-lg"></div> */}
        
        <button
          onClick={scrollToTop}
          className={`relative z-10 p-3 ${buttonColor} text-white rounded-full !shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center`}
          aria-label="Go to top"
        >
          <ChevronUp size={iconSize} />
        </button>
      </div>
    </motion.div>
  );
};

GoToTopButton.propTypes = {
  threshold: PropTypes.number,
  position: PropTypes.oneOf(["left", "right"]),
  bottomOffset: PropTypes.number,
  buttonColor: PropTypes.string,
  hoverColor: PropTypes.string,
  iconSize: PropTypes.number,
  selectedDocketIds: PropTypes.arrayOf(PropTypes.string)
};

export default GoToTopButton;