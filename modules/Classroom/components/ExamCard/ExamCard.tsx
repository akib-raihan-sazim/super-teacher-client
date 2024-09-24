import { useState } from "react";

import { Card, Flex, Text, Group, Menu, ActionIcon, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import { AiOutlineSchedule } from "react-icons/ai";
import { BsInfoSquare } from "react-icons/bs";
import { HiDotsHorizontal } from "react-icons/hi";

import { useAppSelector } from "@/shared/redux/hooks";
import { selectAuthenticatedUser } from "@/shared/redux/reducers/user.reducer";

import ConfirmDeleteExamModal from "../ConfirmDeleteExamModal/ConfirmDeleteExamModal";
import { IExamCardProps } from "./ExamCard.interface";
import { useStyles } from "./ExamCard.styles";

const ExamCard: React.FC<IExamCardProps> = ({ exam, isPast }) => {
  const { classes } = useStyles();
  const user = useAppSelector(selectAuthenticatedUser);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <Card
        my={"md"}
        px={{ base: "xs", sm: "md", md: "lg" }}
        className={`${classes.card} ${isPast ? classes.pastExamCard : ""}`}
      >
        {user?.userType === "teacher" && (
          <Menu shadow="xl" withArrow offset={-3} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="transparent" color="white" className={classes.actionIcon}>
                <HiDotsHorizontal />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>Edit</Menu.Item>
              <Menu.Item color="red" onClick={() => setIsDeleteModalOpen(true)}>
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
        <Flex justify="space-between" wrap="wrap" align="center">
          <Flex align="center">
            <span className={classes.iconContainer}>
              <AiOutlineSchedule />
            </span>
            <Text fw={700}>{exam.title}</Text>
          </Flex>
        </Flex>

        <Text my={"md"}>{exam.instruction}</Text>

        <Group position="right">
          <Text>
            {isPast ? "Finished on:" : "Schedule for:"}{" "}
            <Text component="span" fw={700}>
              {dayjs(exam.date).format("MMMM D, YYYY")}
            </Text>
          </Text>
        </Group>
        {isPast && (
          <Tooltip
            label="To reschedule this exam, edit the due date and set it to a future date."
            position="right"
            withArrow
          >
            <ActionIcon variant="transparent" color="gray">
              <BsInfoSquare />
            </ActionIcon>
          </Tooltip>
        )}
      </Card>
      <ConfirmDeleteExamModal
        examId={exam.id}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default ExamCard;
