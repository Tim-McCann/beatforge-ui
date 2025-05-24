import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
} from '@chakra-ui/react';
import { Field, Fieldset } from '@chakra-ui/react';
import { toaster } from "@/components/ui/toaster"

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toaster.create({
        title: 'Validation Error',
        description: 'Please enter both username and password.',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Attempting login to:', 'http://localhost:8000/login');
      console.log('Username:', username);
      
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful, received token');
        localStorage.setItem('token', data.token);
        
        toaster.create({
          title: 'Login Successful',
          description: 'Welcome back!',
          type: 'success',
          duration: 2000,
        });
        
        navigate('/'); // Redirect after login
      } else {
        // Handle HTTP errors
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.text();
          console.log('Server error response:', errorData);
          errorMessage = `Server error (${response.status}): ${errorData}`;
        } catch (e) {
          console.log('Could not parse error response');
          errorMessage = `Server error (${response.status})`;
        }

        toaster.create({
          title: 'Login Failed',
          description: response.status === 401 
            ? 'Incorrect username or password.' 
            : errorMessage,
          type: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorTitle = 'Connection Error';
      let errorDescription = 'Unknown error occurred';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorTitle = 'Server Connection Failed';
        errorDescription = 'Cannot connect to the server. Please ensure the server is running on http://localhost:8000';
      } else if (error instanceof Error) {
        errorDescription = error.message;
      }

      toaster.create({
        title: errorTitle,
        description: errorDescription,
        type: 'error',
        duration: 8000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <Box p={8} maxWidth="400px" mx="auto">
      <VStack align="stretch" spacing={4}>
        <Heading as="h2" size="lg" textAlign="center">
          Login
        </Heading>

        <Fieldset.Root>
          <Field.Root>
            <Field.Label htmlFor="username">Username</Field.Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
          </Field.Root>
        </Fieldset.Root>

        <Fieldset.Root>
          <Field.Root>
            <Field.Label htmlFor="password">Password</Field.Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </Field.Root>
        </Fieldset.Root>

        <Button 
          colorScheme="blue" 
          onClick={handleLogin} 
          width="full"
          loading={isLoading}
          loadingText="Logging in..."
        >
          Login
        </Button>

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <Box fontSize="sm" color="gray.500" textAlign="center">
            Server: http://localhost:8000
            <br />
            Default credentials: admin / securepassword
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default Login;