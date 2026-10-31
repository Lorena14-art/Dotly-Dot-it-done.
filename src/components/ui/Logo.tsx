import logo from "../../assets/dotly-logo.png";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-14" }: LogoProps) {
  return (
    <img
      src={logo}
      alt="Dotly: dot it, done."
      className={`w-auto dark:rounded-2xl dark:bg-[#FFF5F8] dark:px-3 dark:py-1 ${className}`}
    />
  );
}
