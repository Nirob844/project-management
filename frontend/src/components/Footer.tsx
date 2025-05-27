// Removed marketing-focused navigation links
const navigation = {
  main: [
    /* Keep empty for dashboard */
  ],
  social: [
    /* Keep empty for dashboard */
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white mt-auto py-4 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} ProjectHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
