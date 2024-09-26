import { projectApi } from "../api.config";
import { IMessage } from "./messages.interface";

const messagesApi = projectApi.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation<IMessage, FormData>({
      query: (formData) => ({
        url: "/messages",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Messages"],
    }),

    getClassroomMessages: builder.query<IMessage[], number>({
      query: (classroomId) => ({
        url: `/messages/classroom/${classroomId}/messages`,
        method: "GET",
      }),
      providesTags: ["Messages"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateMessageMutation, useGetClassroomMessagesQuery } = messagesApi;
