"use client";
import React, { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { formSchema, FormSchema } from "@/helpers/FormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Menu } from "./Menu";

interface EditMenuPositionFormProps {
  updateMenu: (data: Menu) => void;
  handleClose: () => void;
  margin?: boolean;
  data: Menu;
}

const InputWrapper = (props: { children: React.ReactNode }) => {
  return <div className="flex flex-col">{props.children}</div>;
};

const TrashIcon = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5 12.5H22.5M12.5 15H27.5M25.8333 15L25.2489 23.7661C25.1612 25.0813 25.1174 25.7389 24.8333 26.2375C24.5833 26.6765 24.206 27.0294 23.7514 27.2497C23.235 27.5 22.5759 27.5 21.2578 27.5H18.7422C17.4241 27.5 16.765 27.5 16.2486 27.2497C15.794 27.0294 15.4167 26.6765 15.1667 26.2375C14.8826 25.7389 14.8388 25.0813 14.7511 23.7661L14.1667 15M18.3333 18.75V22.9167M21.6667 18.75V22.9167"
        stroke="#475467"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const SearchIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z"
        stroke="#667085"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const EditMenuPositionForm: FC<EditMenuPositionFormProps> = ({
  updateMenu,
  handleClose,
  margin,
  data,
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    updateMenu(data as Menu);
  };

  return (
    <div
      className={`px-4 pb-5 border border-[#EAECF0] rounded-lg flex flex-col gap-2 justify-center items-center bg-white ${
        margin ? "mt-[30px]" : ""
      } w-full`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-row gap-2 pt-5 px-6">
          <div className="flex flex-col gap-2 w-full">
            <InputWrapper>
              <>
                <label htmlFor="label">Nazwa</label>
                <input
                  className="border border-[#D0D5DD] rounded-lg py-2 px-3"
                  {...register("label")}
                  type="text"
                  placeholder="np. Promocje"
                />
              </>
            </InputWrapper>
            <InputWrapper>
              <>
                <label className="text-sm font-medium" htmlFor="url">
                  Link
                </label>
                <input
                  className="border border-[#D0D5DD] rounded-lg py-2 px-3"
                  {...register("url")}
                  type="text"
                  placeholder="Wklej lub wyszukaj"
                />
              </>
            </InputWrapper>
          </div>
          <div onClick={handleClose} className="cursor-pointer">
            <TrashIcon />
          </div>
        </div>
        <div className="w-full px-6 mt-2 flex gap-2">
          <button
            className="rounded-lg border border-[#D0D5DD] px-[14px] py-[10px] font-semibold text-sm text-[#344054]"
            disabled={isSubmitting}
            onClick={handleClose}
          >
            Anuluj
          </button>
          <button
            className="rounded-lg border border-[#D0D5DD] px-[14px] py-[10px] font-semibold text-sm text-[#6941C6]"
            type="submit"
            disabled={isSubmitting}
          >
            Edytuj
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMenuPositionForm;
