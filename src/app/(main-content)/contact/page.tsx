import { StyledLink } from "@/components/StyledLink";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Ben Gubler.",
};

export default function Home() {
  return (
    <>
      <h1 className="mt-8">Contact</h1>
      <ul>
        <li>Email me at hello [at] bengubler [dot] com</li>
        <li>
          DM me on <StyledLink href="https://x.com/nebrelbug">X</StyledLink>
        </li>
      </ul>
      <p>
        If you want to help fund my open-source work or my language projects,
        consider{" "}
        <StyledLink href="https://github.com/sponsors/nebrelbug">
          sponsoring me on GitHub
        </StyledLink>{" "}
        or{" "}
        <StyledLink href="https://paypal.me/bengubler">
          sending me a tip on PayPal
        </StyledLink>
        .
      </p>
    </>
  );
}
