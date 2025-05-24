// src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { logout } from '../hooks/auth';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex
      as="nav"
      align="center"
      gap="4"
      p="4"
      bg="teal.500"
      color="white"
      boxShadow="md"
    >
      <Link to="/">
        <Text fontSize="lg" fontWeight="bold">
          Prompt Form
        </Text>
      </Link>
      <Link to="/queue">
        <Text fontSize="lg" fontWeight="bold">
          Queue Status
        </Text>
      </Link>
      <Spacer />
      <Button
        colorScheme="red"
        variant="outline"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Flex>
  );
};

export default Navbar;
