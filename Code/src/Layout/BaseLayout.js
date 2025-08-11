import React from 'react'
import { Box } from '@mui/material'
import '../styles/responsive-utilities.css'

export default function BaseLayout(props) {
    return (
        <Box 
            className="main_container"
            sx={{
                minHeight: '100vh',
                backgroundColor: 'grey.50',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box 
                className="limani_body"
                sx={{
                    flex: 1,
                    width: '100%',
                    maxWidth: '100vw',
                    overflow: 'auto'
                }}
            >
                { props.children }
            </Box>
        </Box>
    )
}
