"use client";

import { usePathname } from "next/navigation";

import { baseUrl } from "@/lib/config";
import { cn } from "@/lib/utils";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "next-share";

type SocialProps = {
  url: string;
  title: string;
};

export function TwitterButton(props: SocialProps) {
  return (
    <TwitterShareButton {...props}>
      <TwitterIcon size={32} round className="mr-2" />
    </TwitterShareButton>
  );
}

export function RedditButton(props: SocialProps) {
  return (
    <RedditShareButton {...props}>
      <RedditIcon size={32} round className="mr-2" />
    </RedditShareButton>
  );
}

export function LinkedinButton(props: SocialProps) {
  return (
    <LinkedinShareButton {...props}>
      <LinkedinIcon size={32} round className="mr-2" />
    </LinkedinShareButton>
  );
}

export function FacebookButton(props: SocialProps) {
  return (
    <FacebookShareButton {...props}>
      <FacebookIcon size={32} round className="mr-2" />
    </FacebookShareButton>
  );
}

export function Social({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const pathname = usePathname();

  const url = `${baseUrl}${pathname}`;

  return (
    <div className={cn("flex flex-row justify-center", className)}>
      <TwitterButton url={url} title={title} />
      <RedditButton url={url} title={title} />
      <LinkedinButton url={url} title={title} />
      <FacebookButton url={url} title={title} />
    </div>
  );
}
