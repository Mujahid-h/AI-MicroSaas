"use client";
import { useRef } from "react";
import Icon, { ICONS } from "./Icon";

interface UploadZoneProps {
  onFile: (text: string, name: string) => void;
  primaryColor: string;
  accept?: string;
  title?: string;
  subtitle?: string;
}

export default function UploadZone({
  onFile,
  primaryColor,
  accept = ".txt,.csv",
  title = "Upload Document",
  subtitle = "Tap to select a file",
}: UploadZoneProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      onFile(text, file.name);
    };
    reader.readAsText(file);
    // Reset so same file can be re-uploaded
    e.target.value = "";
  };

  return (
    <>
      <input
        type="file"
        ref={fileRef}
        onChange={handleFile}
        accept={accept}
      />
      <div
        className="mx-5 rounded-2xl border-2 border-dashed p-8 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] text-center"
        style={{
          borderColor: primaryColor + "55",
          background: primaryColor + "0D",
        }}
        onClick={() => fileRef.current?.click()}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: primaryColor + "22" }}
        >
          <Icon path={ICONS.upload} size={26} color={primaryColor} />
        </div>
        <div>
          <p className="font-syne font-bold text-base text-white mb-1">
            {title}
          </p>
          <p className="text-xs opacity-50">{subtitle}</p>
          <p className="text-xs mt-1" style={{ color: primaryColor + "99" }}>
            {accept.split(",").join(", ")} supported
          </p>
        </div>
      </div>
    </>
  );
}
