import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Heading,
  Spinner,
  Center,
  Button,
  Link,
} from "@chakra-ui/react";

type Job = {
  prompt: string;
  filename: string;
  status: string;
  started_at?: string;
  finished_at?: string;
};

export default function QueueStatus() {
  const [jobs, setJobs] = useState<Job[] | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/queue-status")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box p={8}>
      <Heading mb={6}>🎵 Job Queue</Heading>

      {!jobs ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : (
        <Table.Root colorScheme="teal">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Prompt</Table.ColumnHeader>
              <Table.ColumnHeader>Filename</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Started</Table.ColumnHeader>
              <Table.ColumnHeader>Completed</Table.ColumnHeader>
              <Table.ColumnHeader>Download</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {jobs.map((job, i) => (
              <Table.Row key={i}>
                <Table.Cell>{job.prompt}</Table.Cell>
                <Table.Cell>{job.filename}.wav</Table.Cell>
                <Table.Cell>{job.status}</Table.Cell>
                <Table.Cell>
                  {job.started_at ? new Date(job.started_at).toLocaleString() : "-"}
                </Table.Cell>
                <Table.Cell>
                  {job.finished_at ? new Date(job.finished_at).toLocaleString() : "-"}
                </Table.Cell>
                <Table.Cell>
                  {job.status === "completed" ? (
                    <Link
                      href={`http://localhost:8000/files/${job.filename}.wav`}
                    >
                      <Button size="sm" colorScheme="blue">
                        Download
                      </Button>
                    </Link>
                  ) : (
                    "-"
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
}
