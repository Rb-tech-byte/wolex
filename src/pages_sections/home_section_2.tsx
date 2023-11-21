import { Box, Container, Grid, Image, Text } from '@mantine/core';
import { m } from 'framer-motion';

const textGradient = 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500';

export default function HomeSection2() {
  return (
    <Container className='text-center mt-36' size='xl'>
      <Text className='mb-14 text-4xl font-extrabold leading-[1.25] text-center'>
        New Personal <span className={textGradient}>Finance App</span>
      </Text>

      <Text className='mb-20 text-lg font-semibold'>
        Ehya lets you take control of your money, balance your income and <br /> expenses, and understand where your money goes.
      </Text>

      <Grid>
        <Grid.Col md={6} className='h-[580px]'>
          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.75 }}>
            <div className='h-36 flex justify-center'>
              <img src='/images/landing_iphone.png' className='h-[580px]' />
            </div>
          </m.div>
        </Grid.Col>
        <Grid.Col md={6} className='h-[580px] flex flex-col justify-center'>
          <Text className='mb-8 max-w-md text-left'>
            Take Ehya wherever you go so that you know what’s going on with your money at all times.
          </Text>
          <Text className='mb-8 max-w-md text-left'>
            Take Ehya wherever you go so that you know what’s going on with your money at all times.
          </Text>
          <Text className='mb-8 max-w-md text-left'>
            Take Ehya wherever you go so that you know what’s going on with your money at all times.
          </Text>
          <Text className='mb-8 max-w-md text-left'>
            Take Ehya wherever you go so that you know what’s going on with your money at all times.
          </Text>
        </Grid.Col>
      </Grid>

      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.75 }}>
        <Box className='flex justify-center mt-[100px] w-full'>
          <img className='' src='/images/home_robot.png' />
        </Box>
      </m.div>
    </Container>
  );
}
