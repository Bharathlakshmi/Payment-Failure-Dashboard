import { styled, Box, Container } from '@mui/material'

export const LandingContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    width: '100vw',
    minWidth: '100vw',
    background: '#1e3c72',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(4),
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '40%',
        height: '60%',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '30%',
        height: '50%',
        background: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0
    }
}))

export const HeroContent = styled(Container)(() => ({
    position: 'relative',
    zIndex: 1,
    animation: 'fadeIn 1s ease-out',
    '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' }
    }
}))

export const CTAButtons = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(6),
    display: 'flex',
    gap: theme.spacing(3),
    justifyContent: 'center',
    flexWrap: 'wrap'
}))

export const FeatureSection = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(10),
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing(4),
    width: '100%',
    maxWidth: '1200px'
}))

export const FeatureCard = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'transform 0.3s ease, background 0.3s ease',
    '&:hover': {
        transform: 'translateY(-10px)',
        background: 'rgba(255, 255, 255, 0.15)'
    }
}))
