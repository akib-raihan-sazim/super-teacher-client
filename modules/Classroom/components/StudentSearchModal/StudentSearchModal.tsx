import { Modal, Button, Group, SimpleGrid, Text, Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { Select } from "react-hook-form-mantine";

import {
  useGetUnenrolledStudentsQuery,
  useEnrollStudentMutation,
} from "@/shared/redux/rtk-apis/enrollments/enrollments.api";

import { FormValues, StudentSearchModalProps } from "./StudentSearchModal.interface";
import { useStyles } from "./StudentSearchModal.styles";

const StudentItem = ({ label, email, ...others }: { label: string; email: string }) => (
  <div {...others}>
    <Text size="sm">{label}</Text>
    <Text size="xs" color="dimmed">
      {email}
    </Text>
  </div>
);

const StudentSearchModal: React.FC<StudentSearchModalProps> = ({
  isOpen,
  onClose,
  classroomId,
}) => {
  const { data: unenrolledStudents, isLoading } = useGetUnenrolledStudentsQuery(
    { classroomId },
    { skip: !classroomId },
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { classes } = useStyles();

  const [enrollStudent, { isLoading: isEnrolling }] = useEnrollStudentMutation();

  const onSubmit = async (data: FormValues) => {
    try {
      await enrollStudent({ studentId: Number(data.id), classroomId }).unwrap();
      notifications.show({
        title: "Success",
        message: `Student successfully enrolled in classroom`,
        color: "blue",
      });
      reset();
      onClose();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to enroll student. Please try again.",
        color: "red",
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const studentOptions =
    unenrolledStudents?.map((student) => ({
      label: `${student.user.firstName} ${student.user.lastName}`,
      value: String(student.id),
      email: student.user.email,
    })) || [];

  return (
    <Modal opened={isOpen} onClose={handleClose} centered>
      <Box mx="xl">
        <Text mb={20} fw={700} tt={"uppercase"} size="lg" c={"#4CAF50"}>
          Enroll a Student
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <SimpleGrid>
            <Select
              label="Type a name or email"
              placeholder="Pick student"
              data={studentOptions}
              searchable
              control={control}
              error={errors.id?.message}
              name="id"
              disabled={isLoading}
              dropdownPosition="bottom"
              withinPortal
              maxDropdownHeight={200}
              itemComponent={StudentItem}
              filter={(value, item) =>
                item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
                item["email"]?.toLowerCase().includes(value.toLowerCase().trim())
              }
              classNames={{
                dropdown: classes.dropdown,
                input: classes.input,
                error: classes.error,
                label: classes.label,
              }}
            />
          </SimpleGrid>
          {isLoading && (
            <Text color="dimmed" size="sm" mt="sm">
              Loading students...
            </Text>
          )}
          <Group mt="xl" mb="sm" position="right">
            <Button size="sm" onClick={handleClose} style={{ background: "#4CAF50" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              color="green"
              style={{ background: "#4CAF50" }}
              disabled={isEnrolling}
              loading={isEnrolling}
            >
              {!isEnrolling && "Enroll"}
            </Button>
          </Group>
        </form>
      </Box>
    </Modal>
  );
};
export default StudentSearchModal;
