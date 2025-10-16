import React from 'react';
import EmptyContent from '../../../components/empty-content/EmptyContent';

const CustomNoRowsOverlay = () => (
  <div style={{ textAlign: 'center' }}>
    <EmptyContent
      title="No Data"
      sx={{
        '& span.MuiBox-root': { height: 180 },
      }}
    />
  </div>
);

export default CustomNoRowsOverlay;
