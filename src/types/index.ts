import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IInput {
  variant?: "flat" | "bordered" | "faded" | "underlined";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  type?: string;
  label: string;
  name: string;
  disabled?: boolean;
}

export interface IProject {
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
  frontend?: string;
  backend?: string;
}

export interface ISkill {
  _id?: string;
  name: string;
}

export interface IUser {
  id?: string;
  name?: string;
  email?: string;
  profilePhoto?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
