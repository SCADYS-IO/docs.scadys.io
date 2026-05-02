import React from 'react';
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

export default function SchematicViewer({ src, alt }) {
  const url = useBaseUrl(src);
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <TransformWrapper initialScale={1} minScale={0.25} maxScale={8} wheel={{ step: 0.1 }}>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div style={toolbarStyle}>
              <button style={btnStyle} onClick={() => zoomIn()} title="Zoom in">+</button>
              <button style={btnStyle} onClick={() => zoomOut()} title="Zoom out">−</button>
              <button style={{ ...btnStyle, fontSize: 13, padding: '4px 8px' }} onClick={() => resetTransform()} title="Reset">Reset</button>
            </div>
            <div style={wrapperStyle}>
              <TransformComponent wrapperStyle={{ width: '100%' }} contentStyle={{ width: '100%' }}>
                <img src={url} alt={alt} style={{ width: '100%', display: 'block' }} />
              </TransformComponent>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
