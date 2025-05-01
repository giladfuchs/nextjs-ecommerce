import clsx from "clsx";
// import LogoIcon from "./icons/logo";
import Image from 'next/image';

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black",
        {
          "h-[45px] w-[60px] rounded-xl": !size,
          "h-[30px] w-[30px] rounded-lg": size === "sm",
        },
      )}
    >
      <Image
        src="/logo.ico" // ✅ put your logo file in /public/logo.png
        alt={`  logo`}
        width={80}      // 👈 adjust as needed
        height={20}
      />
    </div>
  );
}

