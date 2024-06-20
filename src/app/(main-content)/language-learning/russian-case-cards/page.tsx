import { Comments } from "@/components/Comments";
import { Social } from "@/components/Social";
import { StyledLink } from "@/components/StyledLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "next-view-transitions";

export const metadata = {
  title: "Russian Case Cards",
  description: "I built case cards for Russian so you don't have to.",
};

export default function Home() {
  return (
    <>
      <Breadcrumb className="not-prose">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/language-learning">Language Learning</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{metadata.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="mt-4">{metadata.title}</h1>
      <p className="text-lg text-muted-foreground">{metadata.description}</p>

      <div className="">
        <p>
          I spent many hours creating this! Print it out and you&apos;ll
          memorize the Russian declension patterns in no time.
        </p>

        <p>
          You may also be interested in my{" "}
          <StyledLink href="https://decline.vercel.app/">
            website for practicing Czech/Russian declensions
          </StyledLink>{" "}
          or my{" "}
          <StyledLink href="./czech-case-cards">Czech case cards</StyledLink>.
        </p>

        <h2>Case Card</h2>

        <p>
          Note: this won&apos;t display properly on mobile: go{" "}
          <StyledLink href="/declensions/russian-cases-card.pdf">
            here
          </StyledLink>{" "}
          to view and download the PDF in a new window.
        </p>

        <embed
          src="/declensions/russian-cases-card.pdf"
          width="100%"
          height="800px"
          type="application/pdf"
        ></embed>

        <Social title={metadata.title} className="my-8" />
        <Comments />
      </div>
    </>
  );
}
