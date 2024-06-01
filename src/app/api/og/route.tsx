import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const hasTitle = searchParams.has("title")
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "Ben Gubler"

    const hasDescription = searchParams.has("description")
    const description = hasDescription
      ? searchParams.get("description")?.slice(0, 100)
      : "Open-source developer, student in ML, and aspiring polyglot. Creator of Eta and Squirrelly."

    return new ImageResponse(
      (
        <div tw="flex flex-col h-full w-full bg-white items-center p-5 px-24">
          <h2 tw="absolute top-5 uppercase tracking-.1 text-5xl w-full mt-0">
            bengubler.com
          </h2>
          <p tw="absolute top-22 text-gray-500 text-3xl -mt-5 w-full">
            Hello! Ahoj! Привет!
          </p>

          <div tw="grow flex flex-col items-center justify-center">
            <h1 tw="text-7xl text-center max-w-4xl">{title}</h1>
            <p tw="text-4xl text-gray-500 text-center max-w-4xl">
              {description}
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630
      }
    )
  } catch (e: any) {
    console.log(`OG API ERROR: ${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500
    })
  }
}
