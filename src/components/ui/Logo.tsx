import logo from "../../assets/dotly-logo.png";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-14" }: LogoProps) {
  return (
    <img
      src={logo}
      alt="Dotly: dot it, done."
      className={`w-auto ${className}`}
    />
  );
}
