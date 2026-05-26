import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import useBaseUrl from '@docusaurus/useBaseUrl';

const btnStyle = {
  background: 'var(--ifm-color-primary)',
  border: 'none',
  borderRadius: 4,
  color: '#fff',
  cursor: 'pointer',
  fontSize: 18,
  lineHeight: 1,
  padding: '4px 10px',
};

const toolbarStyle = {
  display: 'flex',
  gap: 4,
  marginBottom: 6,
};

const wrapperStyle = {
  border: '1px solid var(--ifm-color-emphasis-300)',
  borderRadius: 6,
  overflow: 'hidden',
  background: 'var(--ifm-background-color)',
};

// SchematicViewer renders an SVG schematic with pan/zoom controls.
// Two optional ways to start with a focused view:
//   viewBox="x y w h"      — HARD-CROPS the SVG to the region (legacy behaviour);
//                            zoom/pan only works within the cropped region.
//   initialFocus="x y w h" — preserves the full SVG; sets initial transform so the
//                            region fills the viewport. User can zoom out / pan
//                            to see the rest of the schematic. Reset button
//                            returns to this focused view.
export default function SchematicViewer({ src, alt, viewBox, initialFocus }) {
  const url = useBaseUrl(src);
  const [svgContent, setSvgContent] = useState(null);
  const [svgViewBox, setSvgViewBox] = useState(null);
  const containerRef = useRef(null);
  const transformRef = useRef(null);

  useEffect(() => {
    if (!viewBox && !initialFocus) return;
    setSvgContent(null);
    setSvgViewBox(null);
    fetch(url)
      .then(r => r.text())
      .then(text => {
        const vbMatch = text.match(/viewBox="([^"]+)"/);
        if (vbMatch) {
          const parts = vbMatch[1].split(/\s+/).map(parseFloat);
          if (parts.length === 4 && parts.every(n => !isNaN(n))) {
            setSvgViewBox(parts);
          }
        }
        let patched = text
          .replace(/\bwidth="[^"]*mm"/, 'width="100%"')
          .replace(/\bheight="[^"]*mm"/, '');
        if (viewBox) {
          patched = patched.replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`);
        }
        setSvgContent(patched);
      })
      .catch(() => setSvgContent(null));
  }, [url, viewBox, initialFocus]);

  const applyInitialFocus = useCallback(() => {
    if (!initialFocus || !svgViewBox || !transformRef.current || !containerRef.current) return;
    const parts = initialFocus.split(/\s+/).map(parseFloat);
    if (parts.length !== 4 || parts.some(n => isNaN(n))) return;
    const [fx, fy, fw, fh] = parts;
    const [, , totalW, totalH] = svgViewBox;
    const CW = containerRef.current.clientWidth;
    if (CW <= 0 || fw <= 0) return;
    const CH = CW * (totalH / totalW);
    // Fit focus width to container width.
    const scale = totalW / fw;
    // Translate so focus region is centered in the viewport.
    const positionX = -CW * fx / fw;
    const positionY = (CH - fh * CW / fw) / 2 - CW * fy / fw;
    transformRef.current.setTransform(positionX, positionY, scale, 0);
  }, [initialFocus, svgViewBox]);

  // Apply initial focus once content has loaded and the container has a width.
  useEffect(() => {
    if (!initialFocus || !svgContent || !svgViewBox) return;
    let cancelled = false;
    const tryApply = () => {
      if (cancelled) return;
      if (containerRef.current && containerRef.current.clientWidth > 0) {
        applyInitialFocus();
      } else {
        requestAnimationFrame(tryApply);
      }
    };
    requestAnimationFrame(tryApply);
    return () => { cancelled = true; };
  }, [svgContent, svgViewBox, initialFocus, applyInitialFocus]);

  const content = (viewBox || initialFocus) && svgContent
    ? <div style={{ width: '100%', lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: svgContent }} />
    : <img src={url} alt={alt} style={{ width: '100%', display: 'block' }} />;

  return (
    <div ref={containerRef} style={{ marginBottom: '1.5rem' }}>
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.25}
        maxScale={20}
        wheel={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div style={toolbarStyle}>
              <button style={btnStyle} onClick={() => zoomIn()} title="Zoom in">+</button>
              <button style={btnStyle} onClick={() => zoomOut()} title="Zoom out">−</button>
              <button
                style={{ ...btnStyle, fontSize: 13, padding: '4px 8px' }}
                onClick={() => {
                  if (initialFocus) {
                    applyInitialFocus();
                  } else {
                    resetTransform();
                  }
                }}
                title="Reset"
              >Reset</button>
            </div>
            <div style={wrapperStyle}>
              <TransformComponent wrapperStyle={{ width: '100%' }} contentStyle={{ width: '100%' }}>
                {content}
              </TransformComponent>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
