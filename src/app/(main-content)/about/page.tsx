import { StyledLink } from "@/components/StyledLink";

export const metadata = {
  title: "About Me",
  description: "Learn more about Ben Gubler",
};

export default function Home() {
  return (
    <>
      <h1 className="mt-8">{metadata.title}</h1>
      <p>
        My name's Ben, but you might know me by my GitHub username,{" "}
        <StyledLink href="https://github.com/nebrelbug">@nebrelbug</StyledLink>.
      </p>
      <p>
        I study machine learning and (human) languages. In my free time, I like
        to build websites and open-source libraries. I'll probably post about
        all of the above from time to time.
      </p>
      <p>
        I'm currently a student at Brigham Young University in Provo, where I'm
        pursuing a major in ACME (Applied and Computational Mathematics) and a
        minor in Arabic. I'm also a research assistant in the PCCL (Perception,
        Control, and Cognition Lab) at BYU, where I study novel applications of
        artificial intelligence and Natural Language Processing.
      </p>
      <p className="font-bold">Fun facts about me:</p>
      <ul>
        <li>
          I'm passionate about language learning — I speak English, Czech, and
          Slovak, and am currently learning Russian and Arabic.
        </li>
        <li>
          I love spending time in the outdoors! Backpacking, fishing, and
          mountain biking are some of my favorite hobbies.
        </li>
        <li>I enjoy great literature, both contemporary and classic!</li>
      </ul>
    </>
  );
}
