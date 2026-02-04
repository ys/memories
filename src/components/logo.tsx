import Link from "next/link";
import Icon from "./icon";
import logoSvg from "../../public/logo.svg";

export function Logo() {
  return (
    <Link
      href="/"
      className="fixed top-6 left-6 z-[1001] select-none hover:scale-105 transition-transform"
    >
      <div
        className="bg-white shadow-xl"
        style={{
          padding: "4px",
          paddingBottom: "12px",
          transform: "rotate(-2deg)",
        }}
      >
        <div
          className="bg-gray-400 flex items-center justify-center p-2"
          style={{ width: 48, height: 48 }}
        >
          <Icon src={logoSvg} className="text-yellow-400" />
        </div>
      </div>
    </Link>
  );
}
