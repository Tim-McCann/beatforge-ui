import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Link,
  Table,
  Text,
  Spinner,
} from '@chakra-ui/react';

interface Job {
  prompt: string;
  filename: string;
  duration: number;
  status: string;
  started_at: string;
  finished_at: string;
}

interface QueueStatusResponse {
  count: number;
  jobs: Job[];
}

const QueueStatus: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQueueStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/queue-status');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: QueueStatusResponse = await response.json();
      setJobs(data.jobs);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch queue status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueStatus();
    const interval = setInterval(fetchQueueStatus, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Box p={5}>
      <Text fontSize="2xl" mb={4}>
        Music Generation Queue Status
      </Text>

      {loading && (
        <Box mb={4}>
          <Spinner size="lg" />
          <Text>Loading...</Text>
        </Box>
      )}

      {error && (
        <Box mb={4} color="red.500">
          Error: {error}
        </Box>
      )}

      {!loading && !error && jobs.length === 0 && (
        <Text>No jobs in queue.</Text>
      )}

      {!loading && !error && jobs.length > 0 && (
        <Table.Root size="sm" colorScheme="gray">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Prompt</Table.ColumnHeader>
              <Table.ColumnHeader>Filename</Table.ColumnHeader>
              <Table.ColumnHeader>Duration (s)</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Started At</Table.ColumnHeader>
              <Table.ColumnHeader>Finished At</Table.ColumnHeader>
              <Table.ColumnHeader>Download</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {jobs.map((job, index) => (
              <Table.Row key={index}>
                <Table.Cell>{job.prompt}</Table.Cell>
                <Table.Cell>{job.filename}</Table.Cell>
                <Table.Cell>{job.duration}</Table.Cell>
                <Table.Cell>{job.status}</Table.Cell>
                <Table.Cell>{new Date(job.started_at).toLocaleString()}</Table.Cell>
                <Table.Cell>
                  {job.finished_at && job.finished_at !== '0001-01-01T00:00:00Z'
                    ? new Date(job.finished_at).toLocaleString()
                    : '-'}
                </Table.Cell>
                <Table.Cell>
                  {job.status === 'completed' && (
                    <Link
                      href={`http://localhost:8000/files/${job.filename}.wav`}
                      download
                    >
                      <Button colorScheme="blue" size="sm">
                        Download WAV
                      </Button>
                    </Link>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
};

export default QueueStatus;
