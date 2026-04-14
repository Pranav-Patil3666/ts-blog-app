import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";

const FULL_TEXT = "Just BLOG it...";

function getTypedParts(text) {
  const just = "Just ";
  const blog = "BLOG";
  const tail = " it...";

  return {
    just: text.slice(0, just.length),
    blog: text.length > just.length ? text.slice(just.length, just.length + blog.length) : "",
    tail:
      text.length > just.length + blog.length
        ? text.slice(just.length + blog.length, just.length + blog.length + tail.length)
        : "",
  };
}

export function Loader({ onComplete }) {
  const [typedLength, setTypedLength] = useState(0);
  const [showPointer, setShowPointer] = useState(false);
  const [clicked, setClicked] = useState(false);
  const typedText = useMemo(() => FULL_TEXT.slice(0, typedLength), [typedLength]);
  const parts = useMemo(() => getTypedParts(typedText), [typedText]);

  useEffect(() => {
    const typingInterval = window.setInterval(() => {
      setTypedLength((current) => {
        if (current >= FULL_TEXT.length) {
          window.clearInterval(typingInterval);
          return current;
        }

        return current + 1;
      });
    }, 95);

    const pointerTimeout = window.setTimeout(() => setShowPointer(true), 1450);
    const clickTimeout = window.setTimeout(() => setClicked(true), 2050);
    const completeTimeout = window.setTimeout(() => onComplete?.(), 2750);

    return () => {
      window.clearInterval(typingInterval);
      window.clearTimeout(pointerTimeout);
      window.clearTimeout(clickTimeout);
      window.clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      animate={clicked ? { opacity: 0 } : { opacity: 1 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-vanilla"
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        animate={clicked ? { scale: 1.08 } : { scale: 1 }}
        className="relative"
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center text-6xl font-extrabold tracking-[-0.06em] text-ink sm:text-7xl">
          <span>{parts.just}</span>
          <span className="text-copper">{parts.blog}</span>
          <span>{parts.tail}</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            className="ml-1 inline-block text-ink"
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            |
          </motion.span>
        </div>

        {showPointer ? (
          <motion.div
            animate={
              clicked
                ? { x: 4, y: 2, scale: 0.9 }
                : { x: [0, -6, 0], y: [0, 6, 0], scale: [1, 0.96, 1] }
            }
            className="absolute -right-8 top-16 text-copper sm:-right-12 sm:top-20"
            transition={{
              duration: clicked ? 0.18 : 0.7,
              ease: "easeInOut",
              repeat: clicked ? 0 : 1,
              repeatType: "reverse",
            }}
          >
            <MousePointer2 className="h-8 w-8 fill-current" />
          </motion.div>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
