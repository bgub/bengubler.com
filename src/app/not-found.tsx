import MainContentLayout from "@/app/(main-content)/layout";

export default function NotFound() {
  return (
    <MainContentLayout>
      <h2 className="text-4xl text-center font-bold mt-20">
        404 - Page Not Found
      </h2>
      <p className="text-center mt-10">
        Sorry! Try going back to the page you were just on.
      </p>{" "}
    </MainContentLayout>
  );
}
