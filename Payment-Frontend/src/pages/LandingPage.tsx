import React from 'react'
import { Typography, Button, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
    RocketLaunchOutlined,
    ShieldOutlined,
    ShowChartOutlined,
    LoginOutlined,
    PersonAddOutlined
} from '@mui/icons-material'
import {
    LandingContainer,
    HeroContent,
    CTAButtons,
    FeatureSection,
    FeatureCard
} from '../styles/landingPageStyles'

const LandingPage: React.FC = () => {
    const navigate = useNavigate()
    const theme = useTheme()

    return (
        <LandingContainer>
            <HeroContent maxWidth="md">
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        mb: 2,
                        fontSize: { xs: '2rem', md: '3rem' }
                    }}
                >
                    Master Your Payment Flows
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        opacity: 0.9,
                        mb: 4,
                        fontWeight: 400,
                        maxWidth: '600px',
                        mx: 'auto',
                        fontSize: { xs: '1rem', md: '1.25rem' }
                    }}
                >
                    A comprehensive dashboard to monitor, simulate, and resolve payment failures. Take control of your gateway's reliability.
                </Typography>

                <CTAButtons>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<LoginOutlined />}
                        onClick={() => navigate('/login')}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            bgcolor: '#fff',
                            color: theme.palette.primary.main,
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.9)'
                            }
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<PersonAddOutlined />}
                        onClick={() => navigate('/signup')}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            color: '#fff',
                            borderColor: '#fff',
                            '&:hover': {
                                borderColor: 'rgba(255, 255, 255, 0.8)',
                                bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }}
                    >
                        Sign Up
                    </Button>
                </CTAButtons>

                <FeatureSection>
                    <FeatureCard>
                        <ShowChartOutlined sx={{ fontSize: 40, mb: 2, color: '#fff' }} />
                        <Typography variant="h6" sx={{ mb: 1 }}>Real-time Analytics</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Track failure rates, channel distribution, and root cause trends as they happen.
                        </Typography>
                    </FeatureCard>

                    <FeatureCard>
                        <RocketLaunchOutlined sx={{ fontSize: 40, mb: 2, color: '#fff' }} />
                        <Typography variant="h6" sx={{ mb: 1 }}>Failure Simulation</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Stress test your system with simulated timeouts and technical errors.
                        </Typography>
                    </FeatureCard>

                    <FeatureCard>
                        <ShieldOutlined sx={{ fontSize: 40, mb: 2, color: '#fff' }} />
                        <Typography variant="h6" sx={{ mb: 1 }}>Secure Gateway</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Integration with top payment providers like Razorpay for secure transactions.
                        </Typography>
                    </FeatureCard>
                </FeatureSection>
            </HeroContent>
        </LandingContainer>
    )
}

export default LandingPage
