import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  Box,
  Text,
  SimpleGrid,
  TextInput,
  Textarea,
  FileInput,
  Button,
  Group,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useForm, Controller } from "react-hook-form";

import { ApiError } from "@/modules/Login/containers/LoginContainer.types";
import { useUploadResourceMutation } from "@/shared/redux/rtk-apis/classworks/classworks.api";

import { materialFormSchema, TMaterialFormValues } from "./MaterialFormModal.helpers";
import { IMaterialFormModalProps } from "./MaterialFormModal.interface";
import { inputStyles } from "./MaterialFormModal.styles";

const MaterialFormModal: React.FC<IMaterialFormModalProps> = ({ opened, onClose, classroomId }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<TMaterialFormValues>({
    resolver: zodResolver(materialFormSchema),
    mode: "onBlur",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadResource] = useUploadResourceMutation();

  const onSubmit = async (data: TMaterialFormValues) => {
    setIsLoading(true);
    try {
      await uploadResource({
        file: data.file,
        classroomId,
        title: data.title,
        description: data.description,
      }).unwrap();

      showNotification({
        title: "Success",
        message: "Resource uploaded successfully!",
        color: "blue",
      });

      reset();
      onClose();
    } catch (error) {
      showNotification({
        title: "Upload failed",
        message: (error as ApiError).data?.message,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleCancel} size="md" centered>
      <Box mx="xl">
        <Text mb={20} fw={700} tt="uppercase" size="lg" c="#4CAF50">
          Upload Material
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SimpleGrid>
            <TextInput
              size="md"
              label="Title"
              placeholder="Enter a title"
              error={errors.title?.message}
              styles={inputStyles}
              {...register("title")}
            />
            <Textarea
              size="md"
              label="Description"
              placeholder="Enter a description"
              error={errors.description?.message}
              styles={inputStyles}
              {...register("description")}
            />
            <Controller
              name="file"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <Box>
                  <TextInput
                    size="md"
                    label="Upload file"
                    placeholder="Select a file"
                    value={value?.name || ""}
                    onClick={() => document.getElementById("hidden-file-input")?.click()}
                    readOnly
                    styles={inputStyles}
                    error={errors.file?.message}
                  />
                  <FileInput
                    id="hidden-file-input"
                    style={{ display: "none" }}
                    onChange={(file) => onChange(file)}
                    {...rest}
                  />
                </Box>
              )}
            />
          </SimpleGrid>
          <Group mt="xl" mb="sm">
            <Button size="sm" color="gray" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              style={{ backgroundColor: "#4CAF50", color: "white" }}
              loading={isLoading}
            >
              Create
            </Button>
          </Group>
        </form>
      </Box>
    </Modal>
  );
};

export default MaterialFormModal;
