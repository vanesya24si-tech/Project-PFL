import React, { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

const TOTAL_FRAMES = 201;

// Pads numbers with leading zeros (e.g., 1 -> "001")
const pad = (num, size = 3) => num.toString().padStart(size, "0");

// Helper to draw an image as object-cover on HTML5 Canvas
const drawImageCover = (ctx, img, w, h) => {
  const iw = img.width;
  const ih = img.height;
  const r = Math.min(w / iw, h / ih);
  let nw = iw * r;
  let nh = ih * r;
  let ar = 1;

  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
  nw *= ar;
  nh *= ar;

  const cw = iw / (nw / w);
  const ch = ih / (nh / h);

  const cx = Math.max(0, (iw - cw) * 0.5);
  const cy = Math.max(0, (ih - ch) * 0.5);

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(
    img,
    cx,
    cy,
    cw,
    ch,
    0,
    0,
    w,
    h
  );
};

export default function SequenceScroll({ onLoadingProgress, onLoaded }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const currentFrameRef = useRef(1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Preload and Cache all 201 images
  useEffect(() => {
    let loadedCount = 0;
    const imgArray = [];

    const handleImageLoad = () => {
      loadedCount++;
      const percent = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));
      if (onLoadingProgress) onLoadingProgress(percent);

      if (loadedCount === TOTAL_FRAMES) {
        setImagesLoaded(true);
        if (onLoaded) onLoaded();
      }
    };

    const handleImageError = (e) => {
      console.error("Failed to load image frame:", e.target.src);
      handleImageLoad();
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/sequence/ezgif-frame-${pad(i, 3)}.jpg`;
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      imgArray.push(img);
    }

    setImages(imgArray);

    return () => {
      imgArray.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  // 2. Draw first frame once loaded
  useEffect(() => {
    if (imagesLoaded && images.length > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      const resizeCanvas = () => {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        
        const firstImg = images[currentFrameRef.current - 1];
        if (firstImg && firstImg.complete) {
          drawImageCover(ctx, firstImg, canvas.width, canvas.height);
        }
      };

      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }
  }, [imagesLoaded, images]);

  // 3. Render frames on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!imagesLoaded || images.length === 0 || !canvasRef.current) return;

    const frameIndex = Math.min(
      TOTAL_FRAMES,
      Math.max(1, Math.ceil(latest * TOTAL_FRAMES))
    );

    if (frameIndex !== currentFrameRef.current) {
      currentFrameRef.current = frameIndex;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = images[frameIndex - 1];
      
      if (img && img.complete) {
        drawImageCover(ctx, img, canvas.width, canvas.height);
      }
    }
  });

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-[#090d16] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ display: "block" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#090d16] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
