import { projectApi } from "../api.config";
import { CreateExamDto, ExamResponseDto } from "./exams.interface";

const examsApi = projectApi.injectEndpoints({
  endpoints: (builder) => ({
    createExam: builder.mutation<ExamResponseDto, { classroomId: number; data: CreateExamDto }>({
      query: ({ classroomId, data }) => ({
        url: `/classrooms/${classroomId}/exams`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Exams"],
    }),

    getExams: builder.query<ExamResponseDto[], { classroomId: number }>({
      query: ({ classroomId }) => ({
        url: `/classrooms/${classroomId}/exams`,
        method: "GET",
      }),
      providesTags: ["Exams"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateExamMutation, useGetExamsQuery } = examsApi;
