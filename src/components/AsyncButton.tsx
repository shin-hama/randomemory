import * as React from 'react'
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

type Props = Omit<ButtonProps, 'onClick'> & {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>
}
export const AsyncButton: React.FC<Props> = ({ children, onClick, ...buttonProps }) => {
  const [loading, setLoading] = React.useState(false)

  const handleClick: ButtonProps['onClick'] = async (e) => {
    try {
      setLoading(true)
      await onClick(e)
    } finally {
      setLoading(false)
    }
  }
  return (
    // Loading Circle をボタンの中央に表示するために、Gridレイアウトで管理する
    <Box display="grid" alignItems="center" justifyItems="center">
      <CircularProgress
        size="2rem"
        sx={{
          visibility: loading ? 'visible' : 'hidden',
          gridColumn: 1,
          gridRow: 1,
        }}
      />
      <Button
        {...buttonProps}
        onClick={handleClick}
        sx={{
          ...buttonProps.sx,
          height: '100%',
          width: '100%',
          visibility: loading ? 'hidden' : 'visible',
          gridColumn: 1,
          gridRow: 1,
        }}
      >
        {children}
      </Button>
    </Box>
  )
}
