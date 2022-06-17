import React from "react";
import { motion } from "framer-motion";

export interface DashCardProps {
  title: string;
  children: React.ReactElement;
  fullWidth?: boolean;
  colSpan?: number;
  pChild?: number;
}

export const DashCard = ({
  title,
  children,
  fullWidth,
  colSpan,
  pChild,
}: DashCardProps) => {
  return (
    <div
      className={`flex overflow-hidden flex-col w-full min-w-[200px] h-full rounded-3xl border border-gray-300 hover:shadow-md duration-300 cursor-pointer ${
        colSpan && "col-span-" + colSpan
      }`}
    >
      <motion.div
        className="col-span-4 py-4 px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-primary text-2xl font-bold text-gray-900 ">
          {title}
        </p>
      </motion.div>

      <div className={`col-span-2 p-${pChild ? pChild : 0}`}>{children}</div>
    </div>
  );
};
