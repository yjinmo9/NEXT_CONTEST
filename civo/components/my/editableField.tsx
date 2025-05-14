"use client";

import Image from "next/image";
import { useState } from "react";

interface EditableFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

export default function EditableField({
  label,
  name,
  value,
  onChange,
  type = "text",
}: EditableFieldProps) {
  const [isEditable, setIsEditable] = useState(false);

  const toggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={!isEditable}
          className={`w-full px-4 py-2 pr-10 border rounded-xl text-sm ${
            isEditable ? "bg-white text-black" : "bg-gray-100 text-gray-500"
          }`}
        />
        <button
          type="button"
          onClick={toggleEdit}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
        >
          <Image src="/img/profileEdit.png" alt="수정" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}
