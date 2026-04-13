import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';

export default function StickyActions({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        position: 'sticky', top: 0, zIndex: 10,
        bgcolor: '#fff', py: 1.5, mb: 2,
        borderBottom: '1px solid #f0f0f0',
        display: 'flex', justifyContent: 'flex-end',
      }}
    >
      <Stack direction="row" spacing={1}>{children}</Stack>
    </Box>
  );
}
