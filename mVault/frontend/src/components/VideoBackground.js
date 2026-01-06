import React from 'react';
import { Box } from '@mui/material';

const VideoBackground = ({ videoUrl }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1, // Places it behind everything
        overflow: "hidden",
        "&:after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(11, 17, 25, 0.7)", // Dark overlay for readability
        }
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </Box>
  );
};

export default VideoBackground;