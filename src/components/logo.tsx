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
        className="shadow-xl"
        style={{
          background: "#f0ead0",
          padding: "4px",
          paddingBottom: "12px",
          transform: "rotate(-2deg)",
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{ width: 48, height: 48, background: "#c8b888" }}
        >
          <Icon
            src={logoSvg}
            width={32}
            height={32}
            style={{ color: "#f0ead0" }}
            alt=""
          />
        </div>
      </div>
    </Link>
  );
}
