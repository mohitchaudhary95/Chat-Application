import React, { useState } from 'react'
import Background from '../../assets/login2.png';
import Victory from '../../assets/victory.svg';
import {Tabs,TabsContent,TabsList,TabsTrigger} from '../../components/ui/tabs'
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';


const Auth = () => {
  const handleLogin = () => {};
  const handleSignup = () => {};

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-4xl bg-white shadow-2xl rounded-2xl grid xl:grid-cols-2 overflow-hidden'>
        <div className='flex flex-col gap-8 items-center justify-center p-6 md:p-10'>
          <div className='flex items-center justify-center flex-col text-center'>
            <div className='flex items-center justify-center'>
              <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
              <img src={Victory} alt='Victory Emoji' className='h-16 ml-2' />
            </div>
            <p className='font-medium text-gray-600 mt-2'>Fill in the details to get started</p>
          </div>
          <div className='flex items-center justify-center w-full'>
            <Tabs defaultValue="login" className='w-full max-w-sm'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value='signup'>Signup</TabsTrigger>
              </TabsList>
              <TabsContent className='flex flex-col gap-4 mt-6' value='login'>
                <Input
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='h-12'
                />
                <Input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='h-12'
                />
                <Button className='w-full h-12 text-md' onClick={handleLogin}>Login</Button>
              </TabsContent>
              <TabsContent className='flex flex-col gap-4 mt-6' value='signup'>
                <Input
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='h-12'
                />
                <Input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='h-12'
                />
                <Input 
                  type='password'
                  placeholder='Confirm Password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='h-12'
                />
                <Button className='w-full h-12 text-md' onClick={handleSignup}>Signup</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className='hidden xl:flex justify-center items-center p-10 bg-gray-50'>
          <img src={Background} alt='background login' className='w-full h-auto object-contain max-h-[500px]'/>
        </div>
      </div>
    </div>
  );
};

export default Auth;

