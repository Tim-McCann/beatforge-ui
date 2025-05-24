import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Input,
  Field,
  Fieldset,
  VStack,
  Text,
} from '@chakra-ui/react';
import { toaster } from "@/components/ui/toaster"


const PromptForm = () => {
  const [prompt, setPrompt] = useState('');
  const [filename, setFilename] = useState('');
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Function to handle music generation request
  const handleGenerateMusic = async () => {
    if (!prompt || !filename) {
      setMessage('Please provide both a prompt and a filename.');
      return;
    }

    setIsGenerating(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token'); // Get JWT from local storage

      // Send POST request to backend for music generation
      await axios.post(
        'http://localhost:8000/generate',
        { prompt, filename },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('Music generation started! Check the queue for status.');
      toaster.create({
        title: 'Music generation started!',
        description: 'Check the queue for status.',
        type: 'success',
        duration: 5000,
      });
    } catch (error) {
      setMessage('Error generating music. Please try again.');
      toaster.create({
        title: 'Error',
        description: 'There was an error generating the music.',
        type: 'error',
        duration: 5000,
      });
      console.error(error);
    }

    setIsGenerating(false);
  };

  return (
    <Box p={8} maxWidth="500px" mx="auto" borderWidth={1} borderRadius="lg">
      <VStack align="stretch">
        <Fieldset.Root>
          <Field.Root>

          <Field.Label htmlFor="prompt">Prompt</Field.Label>
          <Input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter music prompt"
            required
            />
            </Field.Root>
        </Fieldset.Root>

        <Fieldset.Root>
          <Field.Root>

          <Field.Label htmlFor="filename">Filename</Field.Label>
          <Input
            id="filename"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename"
            required
            />
            </Field.Root>
        </Fieldset.Root>

        <Button
          colorScheme="blue"
          onClick={handleGenerateMusic}
          loading={isGenerating}
          loadingText="Generating..."
          width="full"
        >
          Generate Music
        </Button>

        {message && <Text color="red.500">{message}</Text>}
      </VStack>
    </Box>
  );
};

export default PromptForm;
